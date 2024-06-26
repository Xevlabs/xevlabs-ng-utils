import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { StrapiDatasource } from '../../core/datasource/strapi.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { FilterModel } from '../../models/filter.model';
import { ColumnDefinitionModel } from '../../models/column-defintion.model';
import { ColumnTypesEnum } from '../../models/columnTypesEnum';
import { ActionButtonModel } from '../../models/action-button.model';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'xevlabs-ng-utils-strapi-table',
  templateUrl: './strapi-table.component.html',
  styleUrls: ['./strapi-table.component.scss'],
})
export class StrapiTableComponent implements AfterViewInit {
  @Input() columnsDefinition!: ColumnDefinitionModel[];
  @Input() filters: FilterModel[] = [];
  @Input() dataSource!: StrapiDatasource<any>;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() pageSize = 10;
  @Input() actionButtons! : ActionButtonModel[];
  @Input() routeRedirect?: string;
  @Input() defaultSort?: MatSortable;
  @Input() queryParamProperties?: string[];
  @Input() translateEmptyFields = false;

  @Output() actionToggled = new EventEmitter<{ type: string, entity: any }>()

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public columnTypes = Object.values(ColumnTypesEnum)
  public columnTypesEnum = ColumnTypesEnum;
  public numberOfEntities!: number;
  ngAfterViewInit() {
    if (!this.dataSource) {
      throw new Error('Missing dataSource. Did you pass it to the component ?')
    }
    if (!this.columnsDefinition) {
      throw new Error('Missing columns definition. Did you pass it to the component ?')
    }
    if (this.defaultSort) {
        this.sort.sort(this.defaultSort)
    }
    this.dataSource.initTable(this.paginator, this.sort, this.filters)
    this.dataSource.numberOfEntity$
        .asObservable()
        .pipe(untilDestroyed(this))
        .subscribe(numberOfEntities => {
        this.numberOfEntities = numberOfEntities
    })
  }

  get displayedColumns() {
    return this.columnsDefinition
      .filter(definition => !definition.hidden)
      .map(definition => definition.key)
      .concat(this.actionButtons ? ['actionButtons'] : [])
  }

  handleActionButtonTrigger(action: ActionButtonModel, entity: any) {
    this.actionToggled.emit({ type: action.type,  entity} )
  }

}
