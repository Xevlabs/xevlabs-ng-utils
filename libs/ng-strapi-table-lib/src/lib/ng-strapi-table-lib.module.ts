import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiTableComponent } from './components/strapi-table/strapi-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoModule } from '@ngneat/transloco';
import { ParseObjectKeyPipe } from './core/pipes/parse-object-key.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableLibOptionsModel } from './models/table-lib-options.model';

@NgModule({
  imports: [
    CommonModule,
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
  static forRoot(options?: TableLibOptionsModel): ModuleWithProviders<any> {
    return ({
      ngModule: NgStrapiTableLibModule,
      providers: [
        {
          provide: 'StrapiTableLibOptions',
          useValue: options
        },
      ]
    });
  }
}
