import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiTableComponent } from './components/strapi-table/strapi-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoModule } from '@ngneat/transloco';
import { ParseObjectKeyPipe } from './core/pipes/parse-object-key.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    NoopAnimationsModule,
    HttpClientModule,
    MaterialModule,
    TranslocoModule,
    FlexLayoutModule
  ],
  declarations: [
    StrapiTableComponent,
    ParseObjectKeyPipe
  ],
  exports: [
    StrapiTableComponent
  ]
})
export class NgStrapiTableLibModule {
}
