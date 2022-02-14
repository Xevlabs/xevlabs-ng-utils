import { StrapiFilterTypesEnum } from './strapi-filter-types.enum';

export interface FilterModel {
    attribute: any,
    translationKey?: string,
    type: StrapiFilterTypesEnum,
    operatorName?: string,
    value: any,
}
