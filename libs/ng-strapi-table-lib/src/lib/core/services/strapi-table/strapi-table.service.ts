import { Inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { FilterModel } from '../../../models/filter.model'
import { TableLibOptionsModel } from '../../../models/table-lib-options.model'
import * as qs from 'qs'
import { CollectionResponse } from '../../../models'
import { StrapiFindModel } from '../../../models/strapi-find.model'
import { StrapiBaseResponseDataModel, StrapiV5ResponseDataModel } from '../../../models/strapi-base-response-data.model'
import { map } from 'rxjs/operators'
import { FilterTypeCombinationEnum } from '../../../enums'

function isV5Entry<T>(
    entry: StrapiBaseResponseDataModel<T> | StrapiV5ResponseDataModel<T>
): entry is StrapiV5ResponseDataModel<T> {
    return 'documentId' in entry
}

@Injectable({
    providedIn: null,
})
export class StrapiTableService {
    private baseUrl: string

    constructor(private http: HttpClient,
                @Inject('StrapiTableLibOptions') private readonly options: TableLibOptionsModel,
    ) {
        if (!options || !options.baseUrl) {
            throw new Error('Error: No base url provided. Provide one by using the forRoot method of the lib')
        }
        this.baseUrl = options.baseUrl
    }

	find<T>(collectionName: string, filters: FilterModel[], populate?: string | string[],showDrafts = false, sortOrder = 'asc', sortField = 'id',
            pageNumber = 0, pageSize = 25, search?: string, locale?: string, filterTypeCombination: FilterTypeCombinationEnum = FilterTypeCombinationEnum.AND): Observable<CollectionResponse<T>> {
        let params = new HttpParams()
        if (locale) {
            params = params.append('locale', locale)
        }
        if (populate) {
            const populates = ([] as string[]).concat(populate);
            populates.forEach(param => params = params.append('populate', param));
        }
        if (showDrafts) {
            params = this.options.strapiVersion === 5
                ? params.append('status', 'draft')
                : params.append('publicationState', 'preview')
        }
        if (search) {
            params = params.append('_q', search)
        }
        params = params.appendAll({
            'pagination[limit]': pageSize.toString(),
            'pagination[start]': (pageSize * pageNumber).toString(),
            sort: `${sortField}:${sortOrder.toUpperCase()}`,
        })
        const query = this.parseStrapiFilters(filters, filterTypeCombination)
        return this.http.get<StrapiFindModel<T>>(`${this.baseUrl}/${collectionName}?${query}`, { params }).pipe(map((response: StrapiFindModel<T>) => {
            const total = response.meta.pagination.total;
            // Strapi v5 entries are already flattened ({ id, documentId, ...fields });
            // v4 entries carry the { id, attributes } wrapper that needs merging
            const data: T[] = (response.data ?? []).map(entry =>
                isV5Entry<T>(entry) ? entry : { id: entry.id, ...entry.attributes }
            )
            return { data, total }
        }))
    }

    parseStrapiFilters(rawFilters: FilterModel[], filterTypeCombination: FilterTypeCombinationEnum = FilterTypeCombinationEnum.AND): string {
        const queryFilters: any = {
            filters: {}
        };
        switch (filterTypeCombination) {
            case FilterTypeCombinationEnum.AND:
                queryFilters.filters.$and = [];
                break;
            case FilterTypeCombinationEnum.OR:
                queryFilters.filters.$or = [];
                break;
            default:
                queryFilters.filters.$and = [];
        }
        
        rawFilters.forEach(filter => {
            const key = filter.attribute;
            const type = filter.type;
            const filterObject = { [key]: { [type]: filter.value } };

            switch (filterTypeCombination) {
                case FilterTypeCombinationEnum.AND:
                    queryFilters.filters.$and.push(filterObject);
                    break;
                case FilterTypeCombinationEnum.OR:
                    queryFilters.filters.$or.push(filterObject);
                    break;
                default:
                    queryFilters.filters.$and.push(filterObject);
            }
        });
        const query = qs.stringify(queryFilters,
            {
                encodeValuesOnly: true
            })
        return query
    }
}
