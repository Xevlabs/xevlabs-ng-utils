import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButtonModel, ColumnDefinitionModel, ColumnTypesEnum, FilterModel, StrapiDatasource, StrapiFilterTypesEnum, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';

@UntilDestroy()
@Component({
  selector: 'xevlabs-ng-utils-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StrapiTableService]
})
export class AppComponent implements OnInit, AfterContentChecked {
  @ViewChild('nestedTextField') nestedTextFIeldTemplate!: TemplateRef<any>
  @ViewChild('username') usernameTemplate!: TemplateRef<any>
  filterControl!: FormControl
  selectedObjectByLocale?: any[]
  toggledLocale = true
  locale = 'en'
  actionType?: string
  isDraftObject = false

  public dataSource: StrapiDatasource<any>;
  public filters: FilterModel[] = [];
  public columnsDefinition: ColumnDefinitionModel[] = []
  public actionButtons: ActionButtonModel[] = [{
    type: 'view',
    color: 'primary',
    icon: 'remove_red_eye',
    tooltipKey: 'VIEW'
  }]

  constructor(private tableService: StrapiTableService, private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    this.dataSource = new StrapiDatasource<any>(tableService, 'pages')
  }

  addFilter() {
    this.filters = [{
      type: StrapiFilterTypesEnum.CONTAINS,
      value: this.filterControl.value,
      attribute: 'slug'
    }]
    this.dataSource.updateFilters(this.filters)
  }

  removeFilter() {
    this.filters = []
    this.dataSource.updateFilters(this.filters)
  }

  getDraftsAndPublished() {
    this.isDraftObject = !this.isDraftObject
    this.dataSource.updateShowDrafts(this.isDraftObject)
    this.tableService.find('pages', [], ['*'], this.isDraftObject,'ASC', 'key', 0, 10).pipe(untilDestroyed(this)).subscribe((res) => {
      this.selectedObjectByLocale = res.data
    })
  }

  ngOnInit(): void {
    this.filterControl = this.fb.control('')
  }

  toggleLocale() {
    this.toggledLocale = !this.toggledLocale
    this.getItemsByLocale()
  }

  setSelectedItem(selectedElement: any) {
    this.actionType = selectedElement.type
    const filter: FilterModel = {
      type: StrapiFilterTypesEnum.EQUAL,
      value: selectedElement.entity.id,
      attribute: 'id'
    }
    this.getItemsByLocale([filter])
  }

  getItemsByLocale(filters: FilterModel[] = []) {
    this.tableService.find('pages', filters, ['*'], this.isDraftObject, 'ASC', 'key', 0, 10, undefined ,this.toggledLocale ? 'en' : 'fr').pipe(untilDestroyed(this)).subscribe((res) => {
      this.selectedObjectByLocale = res.data
    })
  }

  ngAfterContentChecked(): void {
    this.columnsDefinition = [
      {
        key: 'slug',
        sortable: true,
        translationKey: 'SLUG',
        type: ColumnTypesEnum.STRING
      },
      {
        key: 'mainColor',
        sortable: true,
        translationKey: 'MAIN_COLOR',
        type: ColumnTypesEnum.NUMBER
      },
      {
        key: 'nested_collection.nestedTextField',
        sortable: true,
        translationKey: 'NESTED_TEXT_FIELD',
        displayedProp: 'nested_collection.nestedTextField',
        type: ColumnTypesEnum.TEMPLATE,
        template: this.nestedTextFIeldTemplate
      },
      {
        key: 'user.username',
        sortable: true,
        translationKey: 'USER.USERNAME',
        displayedProp: 'user.username',
        type: ColumnTypesEnum.TEMPLATE,
        template: this.usernameTemplate
      },
      {
        key: 'updatedAt',
        sortable: true,
        translationKey: 'UPDATED_AT',
        displayedProp: 'updatedAt',
        type: ColumnTypesEnum.DATE
      }
    ]
    this.cdr.detectChanges();
  }
}
