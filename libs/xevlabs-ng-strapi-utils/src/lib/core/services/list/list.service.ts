import { Injectable } from '@angular/core';
import { FilterModel, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    constructor(private tableService: StrapiTableService) { }

    loadPage<T = any>(pageIndex = 0, collectionPath: string, filters: FilterModel[]): Observable<T[]> {
        return this.tableService.find<T>(collectionPath, filters, [],'desc', 'created_at', pageIndex, 5)
    }

    count(collectionPath: string, filters: FilterModel[]): Observable<number> {
        return this.tableService.count(collectionPath, filters)
    }
}
