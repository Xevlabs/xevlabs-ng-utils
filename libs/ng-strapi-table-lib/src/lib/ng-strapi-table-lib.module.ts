import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiTableComponent } from './components/strapi-table/strapi-table.component';
import { MaterialModule } from './material/material.module';
import { TranslocoModule } from '@ngneat/transloco';
import { ParseObjectKeyPipe } from './core/pipes/parse-object-key.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableLibOptionsModel } from './models/table-lib-options.model';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouteParserPipe } from './core/pipes/route-parser.pipe';
import { QueryParamsParserPipe } from './core/pipes/query-params-parser.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslocoModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    StrapiTableComponent,
    SearchBarComponent,
    ParseObjectKeyPipe,
    RouteParserPipe,
    QueryParamsParserPipe,
  ],
  exports: [
    StrapiTableComponent,
    SearchBarComponent,
    RouteParserPipe,
    QueryParamsParserPipe,
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
