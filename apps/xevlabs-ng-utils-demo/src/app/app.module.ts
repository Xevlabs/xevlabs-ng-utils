import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { XevlabsStrapiErrorHandlingModule } from '@xevlabs-ng-utils/xevlabs-strapi-error-handling';
import { XevlabsNgStrapiUtilsModule } from '@xevlabs-ng-utils/xevlabs-ng-strapi-utils';
import { NgStrapiTableLibModule } from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { environment } from '../environments/environment';
import { AutoCompleteWrapperComponent } from './auto-complete-wrapper/auto-complete-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, AutoCompleteWrapperComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HotToastModule.forRoot(),
    HttpClientModule,
    TranslocoRootModule,
    ReactiveFormsModule,
    XevlabsStrapiErrorHandlingModule,
    XevlabsNgStrapiUtilsModule,
    FlexLayoutModule,
    NgStrapiTableLibModule.forRoot({
      baseUrl: environment.baseUrl
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
