import { OperatorModel, StrapiFilterTypesEnum } from '../models';

export const filterNumberOperators: OperatorModel[] = [
    {
        type: 'EQUAL',
        key: StrapiFilterTypesEnum.EQUAL,
    },
    {
        type: 'NOT_EQUAL',
        key: StrapiFilterTypesEnum.NOT_EQUAL,
    },
    {
        type: 'LESS_THAN',
        key: StrapiFilterTypesEnum.LESS_THAN,
    },
    {
        type: 'GREATER_THAN',
        key: StrapiFilterTypesEnum.GREATER_THAN,
    },
    {
        type: 'LESS_THAN_AND_EQUAL_TO',
        key: StrapiFilterTypesEnum.LESS_THAN_AND_EQUAL_TO,
    },
    {
        type: 'GREATER_THAN_AND_EQUAL_TO',
        key: StrapiFilterTypesEnum.GREATER_THAN_AND_EQUAL_TO,
    },
    {
        type: 'CONTAINS',
        key: StrapiFilterTypesEnum.CONTAINS,
    },
    {
        type: 'NOT_CONTAINS',
        key: StrapiFilterTypesEnum.NOT_CONTAINS,
    },
];
