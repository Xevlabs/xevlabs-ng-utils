import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotToastModule } from '@ngneat/hot-toast';
import { TranslocoModule } from '@ngneat/transloco';
import { ErrorHttpInterceptorService } from './services/error-http-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HotToastModule, TranslocoModule],
  providers: []

})
export class XevlabsStrapiErrorHandlingModule {
}
