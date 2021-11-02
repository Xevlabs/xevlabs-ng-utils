import { ColumnTypesEnum } from './columnTypesEnum';

export interface ColumnDefinitionModel {
  key: string,
  translationKey: string,
  sortable?: boolean,
  hidden?: boolean,
  displayedProp?: string,
  type: ColumnTypesEnum
}

