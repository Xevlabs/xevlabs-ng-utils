import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { StrapiTableService } from '../services/strapi-table/strapi-table.service'
import { catchError, finalize, startWith, take, tap } from 'rxjs/operators'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { FilterModel } from '../../models/filter.model'
import { StrapiFilterTypesEnum } from '@xevlabs-ng-utils/xevlabs-strapi-table'

export class StrapiDatasource<T> implements DataSource<T> {
	private entitySubject = new BehaviorSubject<T[]>([])
	private loadingSubject = new BehaviorSubject<boolean>(true)
	private filters$ = new BehaviorSubject<FilterModel[]>([])

	private paginator!: MatPaginator
	private sort!: MatSort

	public numberOfEntity$ = new BehaviorSubject<number>(0)
	public loading$ = this.loadingSubject.asObservable()

	constructor(private tableService: StrapiTableService, private collectionName: string) {
	}

	disableWhileRequest<T>() {
		return (source: Observable<T>): any => {
			this.loadingSubject.next(true)
			return source.pipe(tap(() => this.loadingSubject.next(false)), catchError((error) => {
				this.loadingSubject.next(false);
				throw Error(error)
			}))
		}
	}

	connect(collectionViewer: CollectionViewer): Observable<T[]> {
		return this.entitySubject.asObservable()
	}

	reload() {
		this.loadEntities(
			this.filters$.value,
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize,
		)
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.entitySubject.complete()
		this.loadingSubject.complete()
	}

	private countEntities(filters: FilterModel[]) {
		this.tableService.count(this.collectionName, filters).pipe(take(1)).subscribe(count => {
			this.numberOfEntity$.next(count)
		})
	}

	loadEntities(filters: FilterModel[] = [],
	             sortDirection = 'asc', sortField = 'id', pageIndex = 0, pageSize = 3) {
		this.loadingSubject.next(true)
		this.countEntities(filters)
		this.tableService.find<T>(this.collectionName, filters, sortDirection, sortField, pageIndex, pageSize).pipe(
				take(1),
				catchError(() => of([])),
				finalize(() => this.loadingSubject.next(false)),
			)
			.subscribe(data => this.entitySubject.next(data))
	}

	initTable(paginator: MatPaginator, sort: MatSort, baseFilters: FilterModel[] = []) {
		this.paginator = paginator
		this.sort = sort
		this.filters$.next(baseFilters)
		this.initData()
	}

	private initData() {
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
			this.filters$]).subscribe(([pageEvent, sortEvent, filters]) => {
			this.loadEntities(
				filters,
				sortEvent.direction,
				sortEvent.active,
				this.paginator.pageIndex,
				this.paginator.pageSize,
			)
		})
	}

	updateFilters(newFilters: FilterModel[]) {
		this.filters$.next(newFilters)
	}
    
    search(searchText: string) {
        const newFilters = this.filters$.value.filter(filter => filter.type !== StrapiFilterTypesEnum.SEARCH)
        newFilters.push({attribute: '', type: StrapiFilterTypesEnum.SEARCH, value: searchText.toLowerCase()})
        this.updateFilters(newFilters)
    }
}
