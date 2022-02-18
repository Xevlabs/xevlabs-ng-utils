import { OperatorModel, StrapiFilterTypesEnum } from '../models';

export const filterEnumOperators: OperatorModel[] = [
    {
        type: 'EQUAL',
        key: StrapiFilterTypesEnum.EQUAL,
    },
    {
        type: 'NOT_EQUAL',
        key: StrapiFilterTypesEnum.NOT_EQUAL,
    }
];
