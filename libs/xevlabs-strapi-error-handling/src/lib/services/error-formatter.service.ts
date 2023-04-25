import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerErrorModel } from '../models/server-error.model';
import { HandledErrorModel } from '../models/handled-error.model';
import { TranslocoService } from '@ngneat/transloco';
import { map, switchMap, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ErrorFormatterService {

  constructor(private translateService: TranslocoService) {
  }

  formatServerError(error: ServerErrorModel): Observable<HandledErrorModel> {
    let handledError$: Observable<HandledErrorModel> = of();
    if (!error || !(error.details)) {
      handledError$ = this.handleErrorWithNoDetails(error);
    }
    if (error && error.details && error.details.key) {
      const key = error.details.key
      const translatedKey$ = this.translateService.selectTranslate(error.details.key.toUpperCase());
      handledError$ = translatedKey$.pipe(switchMap((translatedErrorMessage: string) => {
        if (translatedErrorMessage === key.toUpperCase()) {
          return this.handleErrorWithNoTranslation(error);
        } else {
          return of({ code: error.status, translatedMessage: translatedErrorMessage });
        }
      }));
    }
    return handledError$;
  }

  private handleErrorWithNoDetails(error: ServerErrorModel): Observable<HandledErrorModel> {
    if (error && error.message && error.message.length) {
      return of({ code: error.status, translatedMessage: error.message });
    } else {
      return this.handleErrorWithNoKeyAndMessage().pipe(take(1), map((errorMessage: string) => ({
          code: error.status,
          translatedMessage: errorMessage
        })
      ));
    }
  }

  private handleErrorWithNoKeyAndMessage(): Observable<string> {
    return this.translateService.selectTranslate('DEFAULT_ERROR');
  }

  private handleErrorWithNoTranslation(error: ServerErrorModel): Observable<HandledErrorModel> {
    return of({ code: error.status, translatedMessage: error.message })
  }
}
