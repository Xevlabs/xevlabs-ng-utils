import { Inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { FilterModel } from '../../../models/filter.model'
import { TableLibOptionsModel } from '../../../models/table-lib-options.model'
import * as qs from 'qs'

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

    count(collectionName: string, filters: FilterModel[]) {
        const params = this.parseStrapiFilters(filters)
        return this.http.get<number>(`${this.baseUrl}/${collectionName}/count?${params.toString()}`)
    }

	find<T>(collectionName: string, filters: FilterModel[], sortOrder = 'asc', sortField = 'id',
            pageNumber = 0, pageSize = 3, locale?: string): Observable<T[]> {
        let params = new HttpParams()
        if (locale) {
            params = params.append('_locale', locale)
        }
        params = params.appendAll({
            _limit: pageSize.toString(),
            _start: (pageSize * pageNumber).toString(),
            _sort: `${sortField}:${sortOrder.toUpperCase()}`,
        })
        let query = this.parseStrapiFilters(filters)
        return this.http.get<T[]>(`${this.baseUrl}/${collectionName}?${query}`, { params }).pipe(map((items: any) => {
            return items.length ? items : items.data.map((item: any) => { return { id: item.id, ...item.attributes } })
        }))
    }

    parseStrapiFilters(rawFilters: FilterModel[]): string {
        let queryFilters: any = {
            filters: {
                $and: [],
            },
        }
        rawFilters.map(filter => {
            var key = filter.attribute
            var type = filter.type
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
