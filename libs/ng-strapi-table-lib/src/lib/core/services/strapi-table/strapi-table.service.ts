import { Inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { FilterModel } from '../../../models/filter.model'
import { TableLibOptionsModel } from '../../../models/table-lib-options.model'
import * as qs from 'qs'
import { CollectionResponse } from '../../../models'
import { StrapiFindModel } from '../../../models/strapi-find.model'
import { StrapiBaseResponseDataModel } from '../../../models/strapi-base-response-data.model'
import { map } from 'rxjs/operators'

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
            pageNumber = 0, pageSize = 25, locale?: string): Observable<CollectionResponse<T>> {
        let params = new HttpParams()
        if (locale) {
            params = params.append('locale', locale)
        }
        if (populate) {
            const populates = ([] as string[]).concat(populate);
            populates.forEach(param => params = params.append('populate', param));
        }
        if (showDrafts) {
            params = params.append('publicationState', 'preview')
        }
        params = params.appendAll({
            'pagination[limit]': pageSize.toString(),
            'pagination[start]': (pageSize * pageNumber).toString(),
            sort: `${sortField}:${sortOrder.toUpperCase()}`,
        })
        const query = this.parseStrapiFilters(filters)
        return this.http.get<StrapiFindModel<T>>(`${this.baseUrl}/${collectionName}?${query}`, { params }).pipe(map((response: StrapiFindModel<T>) => {
            const total = response.meta.pagination.total;
            const data = response.data.length ? response.data.map((item: StrapiBaseResponseDataModel<T>) => { return { id: item.id, ...item.attributes } }) : []
            return { data, total }
        }))
    }

    parseStrapiFilters(rawFilters: FilterModel[]): string {
        const queryFilters: any = {
            filters: {
                $and: [],
            },
        }
        rawFilters.map(filter => {
            const key = filter.attribute
            const type = filter.type
            queryFilters.filters.$and.push({
                [key]: {
                    [type]: filter.value
                }
            })
        })
        const query = qs.stringify(queryFilters,
            {
                encodeValuesOnly: true
            })
        return query
    }
}
