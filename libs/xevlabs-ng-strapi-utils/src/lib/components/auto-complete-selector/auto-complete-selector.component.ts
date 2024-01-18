import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Observable, Subscription } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'
import { CollectionResponse, FilterModel, StrapiFilterTypesEnum, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table'
import { MatChipGrid } from '@angular/material/chips'
import { TranslocoService } from '@ngneat/transloco'
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
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
export class AutoCompleteSelectorComponent implements OnInit, ControlValueAccessor, OnChanges {
    @Input() path!: string
    @Input() filters: FilterModel[] = []
    @Input() populate?: string | string [] = "*"
    @Input() showDrafts?: boolean = false
    @Input() collectionName!: string
    @Input() prefix!: string
    @Input() searchByAttribute!: string
    @Input() submitEvent$?: Observable<void>
    @Input() disabled = false;
    @Output() selectedValueChange = new EventEmitter<any>()
    @Input() customLocale?: string
    @Input() chipNumber = 1
    @Input() initList = true
    @Input() matAutoCompleteClasses = ''
    @Input() required = true
    itemListSubscription!: Subscription
    activeLang?: string

    itemList: Record<string, unknown>[] = []
    filteredItemList: Record<string, unknown>[] = []
    busy!: boolean
    autoCompleteForm!: FormGroup

    onChange = (_: { id: number }[] | { id: number } | null) => { }
    onTouched = () => { }

    @ViewChild('refInput', { static: true }) refInput!: ElementRef<HTMLInputElement>
    @ViewChild('chipList', { static: false }) chipList!: MatChipGrid
    constructor(
        private formBuilder: FormBuilder,
        private tableService: StrapiTableService,
        private translocoService: TranslocoService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.required?.previousValue !== changes.required?.currentValue) {
            if (changes.required.currentValue) {
                this.autoCompleteForm?.get('items')?.addValidators(Validators.required);
            } else {
                this.autoCompleteForm?.get('items')?.removeValidators(Validators.required);
            }
        }
    }

    get searchQuery() {
        return this.autoCompleteForm.get('searchQuery')
    }

    get items() {
        return this.autoCompleteForm.get('items')
    }

    get itemValues() {
        return Array.isArray(this.items!.value) ? this.items!.value : [this.items!.value].filter(item => item)
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    registerOnChange(fn: (_: { id: number }[] | { id: number } | null) => void): void {
        this.onChange = fn
    }

    ngOnInit() {
        this.customLocale ? this.customLocale : this.translocoService.getActiveLang()
        this.autoCompleteForm = this.formBuilder.group({
            items: [[]],
            searchQuery: '',
        })
        if (this.required) {
            this.autoCompleteForm.get('items')?.addValidators(Validators.required)
        }
        this.itemListSubscription?.unsubscribe()
        if (this.initList) {
            this.itemListSubscription = this.tableService.find<Record<string, unknown>>(this.collectionName, this.filters, this.populate, this.showDrafts,'asc', 'id', 0, -1, this.activeLang)
                .pipe(untilDestroyed(this))
                .subscribe((items: CollectionResponse<Record<string, unknown>>) => {
                    this.filteredItemList = items.data
                    this.busy = false
                })
        }
        if (this.searchQuery) {
            this.searchQuery.valueChanges.pipe(
                debounceTime(250),
                switchMap((searchTerm: string | undefined) => {
                    if (typeof searchTerm === 'string' && (searchTerm?.length > 2 || this.initList)) {
                        this.busy = true
                        return this.search<Record<string, unknown>>(searchTerm)
                    }
                    return []
                }),
                untilDestroyed(this))
                .subscribe((filteredItemList: CollectionResponse<Record<string, unknown>>) => {
                    this.filteredItemList = filteredItemList.data
                    this.removeSelectedItemsFromFilteredItemList(this.items?.value)
                    this.busy = false
                })
        }
        this.autoCompleteForm.statusChanges.subscribe(status => {
            this.chipList.errorState = status === 'INVALID'
        })
        if (this.submitEvent$) {
            this.submitEvent$.pipe(untilDestroyed(this)).subscribe(() => {
                this.searchQuery?.setValue(null)
            })
        }
    }

    updateInput(form: { items: { id: number }[], searchQuery: string } | null) {
        if (this.chipNumber > 1) {
            this.onChange(form ? form.items : null)
            this.selectedValueChange.next(form?.items)
            if (form) {
                this.removeSelectedItemsFromFilteredItemList(form.items)
            }
        }
        if (this.chipNumber == 1) {
            this.onChange(form && form.items ? form.items[0] : null)
            this.selectedValueChange.next(form && form.items ? form.items[0] : null)
        }
    }

    remove(id: number) {
        if (this.items?.value.length) {
            const filteredList = this.items?.value.filter((item: { id: number }) => item.id !== id)
            this.items?.setValue(filteredList)
        } else {
            this.items?.setValue(null)
        }
        this.updateInput(this.autoCompleteForm.value)
        this.handleSearchQueryState()
        this.onTouched()
    }

    add(event: MatAutocompleteSelectedEvent): void {
        if (event.option.value !== '') {
            let newChipList
            if (this.items!.value?.length) {
                newChipList = this.items?.value.filter((item: { id: number }) => item.id !== event.option.value.id).concat(event.option.value)
            } else {
                newChipList = [event.option.value]
            }
            this.items?.setValue(newChipList)
            this.searchQuery?.setValue(null)
            this.refInput.nativeElement.value = ''
            this.chipList.errorState = !this.items?.value.uid
            this.updateInput(this.autoCompleteForm.value)
            this.handleSearchQueryState()
            this.onTouched()
        }
    }

    removeSelectedItemsFromFilteredItemList(items: { id: number }[]) {
        this.filteredItemList = this.filteredItemList.filter((item) => !items.map((item) => item.id).includes(item['id'] as number))
    }

    handleSearchQueryState() {
        if (this.items?.value?.length >= this.chipNumber) {
            this.searchQuery?.disable()
            return
        }
        this.searchQuery?.enable()
    }

    writeValue(controls?: any): void {
        if (controls) {
            this.busy = true
            if (Array.isArray(controls) && controls.length === 0) {
                this.busy = false
                return
            }
            const arrayedControls = Array.isArray(controls) ? controls : [controls]
            const idList: number[] = arrayedControls.map((control: {id: number} | number) => typeof control == "number"  ? control : control.id);
            const filter: FilterModel = { attribute: 'id', type: StrapiFilterTypesEnum.IN, value: idList }
            this.itemListSubscription?.unsubscribe()
            this.itemListSubscription = this.tableService.find(this.collectionName, [filter], this.populate, this.showDrafts,'asc', 'id', 0, -1, this.activeLang)
                .pipe(untilDestroyed(this)).subscribe((response) => {
                    if (this.chipNumber > 1) {
                        this.items?.setValue(response.data.splice(0, this.chipNumber))
                    }
                    if (this.chipNumber == 1) {
                        this.items?.setValue(response.data[0])
                    }
                    this.searchQuery?.setValue('')
                    if (this.items?.value.length >= this.chipNumber) {
                        this.searchQuery?.disable()
                    }
                    this.busy = false
                })
        }
    }

    validate() {
        return (this.chipList && this.chipList.errorState)
    }

    search<T>(searchQuery: string): Observable<CollectionResponse<T>> {
        const filter = {
            attribute: this.searchByAttribute,
            type: StrapiFilterTypesEnum.CONTAINS,
            value: searchQuery,
        }
        return this.tableService.find<T>(this.collectionName, [...this.filters, filter], this.populate, this.showDrafts,'asc', 'id', 0, -1, this.activeLang)
    }
}
