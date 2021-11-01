import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterModel } from '../../../models/filter.model';

@Injectable({
  providedIn: null
})
export class StrapiTableService {
  constructor(private http: HttpClient) {
  }

  count(collectionName: string, filters: FilterModel[]) {
    let params = new HttpParams();
    filters.forEach(filter => {
      params = params.set(`${filter.attribute}_${filter.type}`, filter.value.toString());
    });
    return this.http.get<number>(`http://localhost:1337/${collectionName}/count`, { params });
  }

  find<T>(collectionName: string, filters: FilterModel[], sortOrder = 'asc', sortField = 'id',
          pageNumber = 0, pageSize = 3): Observable<T[]> {
    let params = new HttpParams()
      .set('_limit', pageSize.toString())
      .set('_start', (pageSize * pageNumber).toString())
      .set('_sort', `${sortField}:${sortOrder.toUpperCase()}`);
    filters.forEach(filter => {
      params = params.set(`${filter.attribute}_${filter.type}`, filter.value.toString());
    });
    return this.http.get<T[]>(`http://localhost:1337/${collectionName}`, {
      params
    });
  }

}
