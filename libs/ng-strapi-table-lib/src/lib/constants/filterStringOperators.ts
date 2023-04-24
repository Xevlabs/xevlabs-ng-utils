import { OperatorModel, StrapiFilterTypesEnum } from '../models';

export const filterStringOperators: OperatorModel[] = [
    {
        type: 'EQUAL',
        key: StrapiFilterTypesEnum.EQUAL,
    },
    {
        type: 'NOT_EQUAL',
        key: StrapiFilterTypesEnum.NOT_EQUAL,
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
