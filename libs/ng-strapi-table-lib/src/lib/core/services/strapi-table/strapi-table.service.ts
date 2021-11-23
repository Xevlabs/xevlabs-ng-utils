import { Inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { FilterModel } from '../../../models/filter.model'
import { TableLibOptionsModel } from '../../../models/table-lib-options.model'

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
	        pageNumber = 0, pageSize = 3): Observable<T[]> {
		let params = this.parseStrapiFilters(filters)
		params = params.appendAll({
			_limit: pageSize.toString(),
			_start: (pageSize * pageNumber).toString(),
			_sort: `${sortField}:${sortOrder.toUpperCase()
			}`,
		})
		return this.http.get<T[]>(`${this.baseUrl}/${collectionName}`, {
			params,
		})
	}

	parseStrapiFilters(filters: FilterModel[]): HttpParams {
		let params = new HttpParams()
		filters.forEach(filter => {
			if (Array.isArray(filter.value)) {
				filter.value.forEach(filterValue => {
					params = params.append(`${filter.attribute}_${filter.type}`, filterValue.toString())
				})
			} else {
				params = params.append(`${filter.attribute}_${filter.type}`, filter.value.toString())
			}
		})
		return params
	}
}
