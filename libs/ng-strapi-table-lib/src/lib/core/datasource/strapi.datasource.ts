import { DataSource } from '@angular/cdk/collections'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { StrapiTableService } from '../services/strapi-table/strapi-table.service'
import { catchError, finalize, startWith, take, tap } from 'rxjs/operators'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CollectionResponse, FilterModel } from '../../models'
import { FilterTypeCombinationEnum } from '../../enums'

export class StrapiDatasource<T> implements DataSource<T> {
    private entitySubject = new BehaviorSubject<T[]>([])
    private loadingSubject = new BehaviorSubject<boolean>(true)
    private filters$ = new BehaviorSubject<FilterModel[]>([])
    private populate: string | string[] = "*"
    private showDrafts = false
    private locale?: string

    private paginator!: MatPaginator
    private sort!: MatSort
    private searchValue$ = new BehaviorSubject<string | undefined>(undefined)
    public numberOfEntity$ = new BehaviorSubject<number>(0)
    public loading$ = this.loadingSubject.asObservable()

    constructor (private tableService: StrapiTableService, private collectionName: string) {
    }

    disableWhileRequest<T> () {
        return (source: Observable<T>): any => {
            this.loadingSubject.next(true)
            return source.pipe(tap(() => this.loadingSubject.next(false)), catchError((error) => {
                this.loadingSubject.next(false);
                throw Error(error)
            }))
        }
    }

    connect (): Observable<T[]> {
        return this.entitySubject.asObservable()
    }

    reload () {
        this.loadEntities(
            this.filters$.value,
            this.populate,
            this.showDrafts,
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchValue$.value
        )
    }

    disconnect (): void {
        this.entitySubject.complete()
        this.loadingSubject.complete()
    }

    loadEntities (filters: FilterModel[] = [], populate?: string | string[], showDrafts?: boolean,
                  sortDirection = 'asc', sortField = 'id', pageIndex = 0, pageSize = 3, search?: string, locale?: string) {
        this.loadingSubject.next(true)
        this.tableService.find<T>(this.collectionName, filters, populate, showDrafts, sortDirection, sortField, pageIndex, pageSize, search, locale).pipe(
                take(1),
                catchError(() => of({data: [], total: 0} as CollectionResponse<T>)),
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe(res => {
                this.entitySubject.next(res.data)
                this.numberOfEntity$.next(res.total)
            })
    }

    initTable (paginator: MatPaginator, sort: MatSort, baseFilters: FilterModel[] = [], populate: string | string[] = this.populate) {
        this.paginator = paginator
        this.sort = sort
        this.populate = populate
        this.filters$.next(baseFilters)
        this.initData()
    }

    private initData () {
        combineLatest([this.filters$, this.sort.sortChange.pipe(startWith({
            direction: this.sort.direction,
            active: this.sort.active,
        }))]).subscribe(() => {
            this.paginator.pageIndex = 0
        })
        combineLatest([this.paginator.page.pipe(startWith({
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
        })), this.sort.sortChange.pipe(startWith({
            direction: this.sort.direction,
            active: this.sort.active,
        })),
            this.filters$,
            this.searchValue$
        ]).subscribe(([pageEvent, sortEvent, filters]) => {
            this.loadEntities(
                filters,
                this.populate,
                this.showDrafts,
                sortEvent.direction,
                sortEvent.active,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.searchValue$.value,
                this.locale
            )
        })
    }

    updateFilters (newFilters: FilterModel[]) {
        this.filters$.next(newFilters)
    }

    updateShowDrafts (showDrafts: boolean) {
        this.showDrafts = showDrafts;
        this.loadEntities(
            this.filters$.value,
            this.populate,
            this.showDrafts,
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchValue$.value
        )
    }

    search (searchText: string) {
        this.searchValue$.next(searchText)
    }
}
