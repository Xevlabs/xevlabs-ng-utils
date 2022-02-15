import { StrapiFilterTypesEnum } from "./strapi-filter-types.enum";

export interface OperatorModel {
  type: string,
  key: StrapiFilterTypesEnum,
}
