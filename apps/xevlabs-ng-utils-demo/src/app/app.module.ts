import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { XevlabsStrapiErrorHandlingModule } from '@xevlabs-ng-utils/xevlabs-strapi-error-handling';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HotToastModule.forRoot(),
    HttpClientModule,
    TranslocoRootModule,
    XevlabsStrapiErrorHandlingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
