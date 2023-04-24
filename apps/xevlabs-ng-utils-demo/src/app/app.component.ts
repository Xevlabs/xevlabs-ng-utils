import { Component } from '@angular/core';
import {
  ActionButtonModel,
  ColumnDefinitionModel, ColumnTypesEnum,
  FilterModel,
  StrapiDatasource, StrapiFilterTypesEnum,
  StrapiTableService
} from '@xevlabs-ng-utils/ng-strapi-table-lib';
import { environment } from '../environments/environment';

@Component({
  selector: 'xevlabs-ng-utils-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StrapiTableService]
})
export class AppComponent {

  public dataSource: StrapiDatasource<any>;
  public filters: FilterModel[] = [];
  public columnsDefinition: ColumnDefinitionModel[] = [
    {
      key: 'key',
      sortable: true,
      translationKey: 'KEY',
      displayedProp: 'key',
      type: ColumnTypesEnum.STRING
    },
    {
      key: 'value',
      sortable: true,
      translationKey: 'VALUE',
      displayedProp: 'value',
      type: ColumnTypesEnum.STRING
    },
    {
      key: 'updated_at',
      sortable: true,
      translationKey: 'UPDATED_AT',
      displayedProp: 'updated_at',
      type: ColumnTypesEnum.DATE
    }
  ]
  public actionButtons: ActionButtonModel[] = [{
    type: 'delete',
    color: 'warn',
    icon: 'delete',
    tooltipKey: 'COMMON.DELETE'
  }]

  constructor(private tableService: StrapiTableService) {
    this.dataSource = new StrapiDatasource<any>(tableService, 'translations')
  }

  addFilter() {
    this.filters = [{
      type: StrapiFilterTypesEnum.CONTAINS,
      value: 'test',
      attribute: 'value'
    }]
    this.dataSource.updateFilters(this.filters)
  }

  removeFilter() {
    this.filters = []
    this.dataSource.updateFilters(this.filters)
  }
}
