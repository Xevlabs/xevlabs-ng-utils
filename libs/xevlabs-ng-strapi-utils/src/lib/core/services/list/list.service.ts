import { Injectable } from '@angular/core';
import { CollectionResponse, FilterModel, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    constructor(private tableService: StrapiTableService) { }

    loadPage<T = any>(pageIndex = 0, collectionPath: string, filters: FilterModel[], populate?: string | string [], showDrafts?: boolean): Observable<CollectionResponse<T>> {
        return this.tableService.find<T>(collectionPath, filters, populate, showDrafts,'desc', 'created_at', pageIndex, 5)
    }
}
