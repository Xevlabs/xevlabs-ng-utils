import { ColumnTypesEnum } from './columnTypesEnum';
import { TemplateRef } from '@angular/core'
import { OperatorModel } from './operator.model';

export interface ColumnDefinitionModel {
  key: string,
  translationKey: string,
  sortable?: boolean,
  hidden?: boolean,
  displayedProp?: string,
  type: ColumnTypesEnum,
  template?: TemplateRef<any>,
  operators?: OperatorModel[],
  attributes?: string[]
}

