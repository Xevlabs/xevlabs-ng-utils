import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FilterModel } from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ListService } from '../../core/services/list/list.service';

@UntilDestroy()
@Component({
    selector: 'xevlabs-ng-utils-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
    busy = true
    @Input() template!: TemplateRef<any>
    @Input() collectionPath!: string
    @Input() filters: FilterModel[] = []
    @Input() refreshList$?: Observable<void>
    @Input() noDataMessage?: string
    itemList: any[] = []
    itemListCount!: number
    pageIndex = 0

    constructor(private listService: ListService) { }

    get loadedAll(): boolean {
        return this.itemList.length === this.itemListCount
    }

    ngOnInit(): void {
        this.initializeList()
        this.refreshList$?.pipe(untilDestroyed(this)).subscribe(() => {
            this.pageIndex = 0
            this.itemList = []
            this.initializeList()
        })
    }

    initializeList(): void {
        this.busy = true
        this.loadItems(0)
    }

    loadItems(pageIndex = 0): void {
        this.busy = true
        this.pageIndex += 1
        this.listService.loadPage(pageIndex, this.collectionPath, this.filters)
            .pipe(
                take(1),
                untilDestroyed(this)
            ).subscribe((response) => {
                this.itemList = this.itemList.concat(response.data)
                this.itemListCount = response.total
                this.busy = false
            })
    }

}
