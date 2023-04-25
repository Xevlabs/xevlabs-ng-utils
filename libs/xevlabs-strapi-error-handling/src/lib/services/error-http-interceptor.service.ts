import { Injectable } from '@angular/core'
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'
import { ServerErrorModel } from '../models/server-error.model'
import { ErrorFormatterService } from './error-formatter.service'
import { HandledErrorModel } from '../models/handled-error.model'
import { HotToastService } from '@ngneat/hot-toast'

@Injectable({
  providedIn: 'root',
})
export class ErrorHttpInterceptorService implements HttpInterceptor {

  constructor(private errorFormatterService: ErrorFormatterService, private toast: HotToastService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpReq = req.clone()
    return next.handle(httpReq).pipe(
      map((result) => {
        return result
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status && error.error?.error) {
            return this.handleError(error.error.error)
        }
        return throwError(error)
      }),
    )
  }

  private handleError(error: ServerErrorModel) {
    const error$ = this.errorFormatterService.formatServerError(error)
    error$.pipe(take(1)).subscribe((error: HandledErrorModel) => this.toast.error(error.translatedMessage, {
      id: 'httpError',
      dismissible: true,
    }))
    return throwError(this.errorFormatterService.formatServerError(error))
  }
}
