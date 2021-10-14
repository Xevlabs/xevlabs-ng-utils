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
    if (!error || !(error.data)) {
      handledError$ = this.handleErrorWithNoData(error);
    }
    if (error && error.data && error.data.key) {
      const translatedKey$ = this.translateService.selectTranslate(error.data.key.toUpperCase());
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

  private handleErrorWithNoData(error: ServerErrorModel): Observable<HandledErrorModel> {
    if (error && error.message && error.message.length) {
      return of({ code: error.statusCode, translatedMessage: error.message });
    } else {
      return this.handleErrorWithNoKeyAndMessage().pipe(take(1), map((errorMessage: string) => ({
          code: error.statusCode,
          translatedMessage: errorMessage
        })
      ));
    }
  }

  private handleErrorWithNoKeyAndMessage(): Observable<string> {
    return this.translateService.selectTranslate('DEFAULT_ERROR');
  }

  private handleErrorWithNoTranslation(error: ServerErrorModel): Observable<HandledErrorModel> {
    return of({ code: error.statusCode, translatedMessage: error.data.message })
  }
}
