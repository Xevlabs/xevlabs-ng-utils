import { StrapiFilterTypesEnum } from './strapi-filter-types.enum';

export interface FilterModel {
    attribute: any,
    type: StrapiFilterTypesEnum,
    value: any,
}
