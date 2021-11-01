import { StrapiFilterTypesEnum } from './strapi-filter-types.enum';

export interface FilterModel {
    attribute: string,
    type: StrapiFilterTypesEnum,
    value: string,
}
