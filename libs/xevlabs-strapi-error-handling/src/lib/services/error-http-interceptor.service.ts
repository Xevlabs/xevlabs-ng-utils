import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ServerErrorModel } from '../models/server-error.model';
import { ErrorFormatterService } from './error-formatter.service';
import { HandledErrorModel } from '../models/handled-error.model';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
    providedIn: 'root'
})
export class ErrorHttpInterceptorService implements HttpInterceptor {

    constructor (private errorFormatterService: ErrorFormatterService, private toast: HotToastService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(result => result),
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    return this.handleError(error.error);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private handleError(error: HttpErrorResponse) {
        const serverError = error.error as ServerErrorModel;
        const error$ = this.errorFormatterService.formatServerError(serverError, error.status)
        error$.pipe(take(1)).subscribe((error: HandledErrorModel) => this.toast.error(error.translatedMessage))
        return throwError(this.errorFormatterService.formatServerError(serverError, error.status));
    }
}
