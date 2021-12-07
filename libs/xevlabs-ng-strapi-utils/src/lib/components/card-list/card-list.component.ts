import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FilterModel } from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { take } from 'rxjs/operators';
import { ListService } from '../../core/services/list/list.service';

@UntilDestroy()
@Component({
    selector: 'mlc-web-admin-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
    busy = true
    @Input() template!: TemplateRef<any>
    @Input() collectionPath!: string
    @Input() filters: FilterModel[] = []
    itemList: any[] = []
    itemListCount!: number
    pageIndex = 0

    constructor(
        private listService: ListService,
        
    ) {
    }

    get loadedAll(): boolean {
        return this.itemList.length === this.itemListCount
    }

    ngOnInit(): void {
        this.listService.count(this.collectionPath, this.filters).pipe(
            untilDestroyed(this)
        ).subscribe((connectionLogCount: number) => {
            this.itemListCount = connectionLogCount
            this.loadItems(0)
        })
    }

    loadItems(pageIndex = 0): void {
        this.busy = true
        this.pageIndex += 1
        this.listService.loadPage(pageIndex, this.collectionPath, this.filters)
            .pipe(
                take(1),
                untilDestroyed(this)
            ).subscribe((itemList) => {
                this.itemList = this.itemList.concat(itemList)
                this.busy = false
            })
    }

}
