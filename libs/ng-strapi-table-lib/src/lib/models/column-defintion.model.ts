import { ColumnTypesEnum } from './columnTypesEnum';
import { TemplateRef } from '@angular/core'

export interface ColumnDefinitionModel {
  key: string,
  translationKey: string,
  sortable?: boolean,
  hidden?: boolean,
  displayedProp?: string,
  type: ColumnTypesEnum,
  template?: TemplateRef<any>,
  attributes?: string[]
}

