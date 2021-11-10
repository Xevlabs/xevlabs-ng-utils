import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core'
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Observable } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'
import { FilterModel, StrapiFilterTypesEnum, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table'
import { MatChipList } from '@angular/material/chips'

@Component({
    selector: 'xevlabs-ng-utils-auto-complete-selector',
    templateUrl: './auto-complete-selector.component.html',
    styleUrls: ['./auto-complete-selector.component.scss'],

    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutoCompleteSelectorComponent),
        multi: true,
    },
        {
            provide: NG_VALIDATORS,
            useExisting: AutoCompleteSelectorComponent,
            multi: true,
        },
        StrapiTableService,
    ],
})
export class AutoCompleteSelectorComponent implements OnInit, ControlValueAccessor {
    @Input() path!: string
    @Input() filters: FilterModel[] = []
    @Input() collectionName!: string
    @Input() prefix!: string
    @Input() searchByAttribute!: string
    @Input() submitEvent$!: Observable<void>

    itemList: Record<string, unknown>[] = []
    filteredItemList: Record<string, unknown>[] = []
    busy = true
    autoCompleteForm!: FormGroup

    onChange!: (_: { id: number }) => void
    onTouched!: () => void

    @ViewChild('refInput', { static: true }) refInput!: ElementRef<HTMLInputElement>
    @ViewChild('chipList', { static: false }) chipList!: MatChipList
    constructor(
        private formBuilder: FormBuilder,
        private tableService: StrapiTableService,
    ) {}

    get searchQuery() {
        return this.autoCompleteForm.get('searchQuery')
    }

    get item() {
        return this.autoCompleteForm.get('item')
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    registerOnChange(fn: (_: { id: number }) => void): void {
        this.onChange = fn
    }

    ngOnInit() {
        this.autoCompleteForm = this.formBuilder.group({
            item: ['', Validators.required],
            searchQuery: '',
        })
        this.tableService.find<Record<string, unknown>>(this.collectionName, this.filters)
            .subscribe((items: Record<string, unknown>[]) => {
            this.filteredItemList = items
            this.busy = false
        })
        if (this.searchQuery) {
            this.searchQuery.valueChanges.pipe(
                debounceTime(250),
                switchMap((searchTerm: string | undefined) => {
                    if (typeof searchTerm === 'string') {
                        this.busy = true
                        return this.search<Record<string, unknown>>(searchTerm)
                    }
                    return []
                }))
                .subscribe((filteredItemList: Record<string, unknown>[]) => {
                this.filteredItemList = filteredItemList
                this.busy = false
            })
        }
        this.autoCompleteForm.statusChanges.subscribe(status => {
            this.chipList.errorState = status === 'INVALID'
        })
        this.submitEvent$.subscribe(() => {
            this.searchQuery?.setValue(null)
        })
    }

    updateInput(form: { item: { id: number }, searchQuery: string } | null) {
        this.onChange({ id: form?.item.id as number })
        this.onTouched()
    }

    remove() {
        this.item?.setValue(null)
        this.updateInput(null)
        this.searchQuery?.enable()
    }

    add(event: MatAutocompleteSelectedEvent): void {
        if (event.option.value !== '') {
            this.item?.setValue(event.option.value)
            this.searchQuery?.setValue(null)
            this.refInput.nativeElement.value = ''
            this.chipList.errorState = !this.item?.value.uid
            this.updateInput(this.autoCompleteForm.value)
            this.searchQuery?.disable()
        }
    }

    writeValue(controls?: unknown): void {
        if (controls) {
            this.busy = true
            const filter = { attribute: 'id', type: StrapiFilterTypesEnum.EQUAL, value: controls }
            this.tableService.find(this.collectionName, [filter]).subscribe((item: unknown[]) => {
                this.item?.setValue(item[0])
                this.searchQuery?.setValue('')
                this.updateInput(this.autoCompleteForm.value)
                this.searchQuery?.disable()
                this.busy = false
            })
        }
    }

    validate() {
        return (this.chipList && this.chipList.errorState)
    }

    search<T>(searchQuery: string): Observable<T[]> {
        const filter = {
            attribute: this.searchByAttribute,
            type: StrapiFilterTypesEnum.CONTAINS,
            value: searchQuery?.toLowerCase(),
        }
        return this.tableService.find<T>(this.collectionName, [...this.filters, filter])
    }

}
