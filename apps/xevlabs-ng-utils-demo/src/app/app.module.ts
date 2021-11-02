import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { XevlabsStrapiErrorHandlingModule } from '@xevlabs-ng-utils/xevlabs-strapi-error-handling';
import { XevlabsNgStrapiUtilsModule } from '@xevlabs-ng-utils/xevlabs-ng-strapi-utils';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AutoCompleteWrapperComponent } from './auto-complete-wrapper/auto-complete-wrapper.component';
import { RoutingModule } from './routing/routing.module';
import { TestNavComponent } from './test-nav/test-nav.component';
import { MaterialModule } from './material/material.module';

@NgModule({
    declarations: [
        AppComponent,
        AutoCompleteWrapperComponent,
        TestNavComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HotToastModule.forRoot(),
        HttpClientModule,
        RoutingModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        TranslocoRootModule,
        MaterialModule,
        XevlabsStrapiErrorHandlingModule,
        XevlabsNgStrapiUtilsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
