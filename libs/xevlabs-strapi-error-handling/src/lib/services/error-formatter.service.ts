import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerErrorModel } from '../models/server-error.model';
import { HandledErrorModel } from '../models/handled-error.model';
import { TranslocoService } from '@ngneat/transloco';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorFormatterService {

  constructor(private translateService: TranslocoService) {
  }

  formatServerError(error: ServerErrorModel, status: number): Observable<HandledErrorModel> {
    let handledError$: Observable<HandledErrorModel> = of();
    if (!error || !(error.details)) {
      handledError$ = this.handleErrorWithNoDetails(error);
    }
    if (error && error.details && error.details.key) {
      const translatedKey$ = this.translateService.selectTranslate(error.details.key.toUpperCase());
      translatedKey$.subscribe((translatedErrorMessage: string) => {
        if (translatedErrorMessage === null) {
          handledError$ = this.handleErrorWithNoTranslation(error);
        } else {
          handledError$ = of({ code: status, translatedMessage: translatedErrorMessage });
        }
      });
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
