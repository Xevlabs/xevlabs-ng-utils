import { StrapiFilterTypesEnum } from './strapi-filter-types.enum';
import { FilterTypeCombinationEnum } from "../enums";

export interface FilterModel {
    attribute: any,
    translationKey?: string,
    type: StrapiFilterTypesEnum,
    combination?: FilterTypeCombinationEnum,
    operatorName?: string,
    value: any,
}
