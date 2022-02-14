import { StrapiFilterTypesEnum } from "@xevlabs-ng-utils/xevlabs-strapi-table";

export interface OperatorModel {
  type: string,
  key: StrapiFilterTypesEnum,
}
