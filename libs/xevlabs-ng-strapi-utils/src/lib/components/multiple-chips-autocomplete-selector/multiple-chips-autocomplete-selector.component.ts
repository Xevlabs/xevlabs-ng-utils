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
    ViewChild,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import {
    CollectionResponse,
    FilterModel,
    StrapiFilterTypesEnum,
    StrapiTableService,
} from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatChipGrid } from '@angular/material/chips';

@UntilDestroy()
@Component({
    selector: 'xevlabs-ng-utils-multiple-chips-autocomplete-selector',
    templateUrl: './multiple-chips-autocomplete-selector.component.html',
    styleUrls: ['./multiple-chips-autocomplete-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(
                () => MultipleChipsAutocompleteSelectorComponent
            ),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: MultipleChipsAutocompleteSelectorComponent,
            multi: true,
        },
        StrapiTableService,
    ],
})
export class MultipleChipsAutocompleteSelectorComponent implements OnInit, ControlValueAccessor, OnChanges
{
    @Input() path!: string;
    @Input() filters: FilterModel[] = [];
    @Input() populate: string | string[] = '*';
    @Input() showDrafts = false;
    @Input() collectionName!: string;
    @Input() prefix!: string;
    @Input() searchByAttribute!: string;
    @Input() submitEvent$?: Observable<void>;
    @Input() disabled = false;
    @Output() selectedValueChange = new EventEmitter<unknown>();
    @Input() customLocale?: string;
    @Input() matAutoCompleteClasses = '';
    @Input() required = true;
    @Input() maxChipNumber?: number;
    
    activeLang?: string;
    itemList: Record<string, unknown>[] = [];
    filteredItemList: Record<string, unknown>[] = [];
    busy = true;
    autoCompleteForm!: FormGroup;

    onChange!: (_: { id: number }[] | null) => void;
    onTouched!: () => void;

    @ViewChild('refInput', { static: true }) refInput!: ElementRef<HTMLInputElement>;
    @ViewChild('chipList', { static: false }) chipList!: MatChipGrid;

    constructor(
        private formBuilder: FormBuilder,
        private tableService: StrapiTableService,
        private translocoService: TranslocoService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
      if (changes.required?.previousValue !== changes.required?.currentValue) {
          if (changes.required.currentValue) {
              this.autoCompleteForm?.get('items')?.addValidators(Validators.required);
          } else {
              this.autoCompleteForm?.get('items')?.removeValidators(Validators.required);
          }
      }
  }

    ngOnInit() {
        this.customLocale ? this.customLocale : this.translocoService.getActiveLang();
        this.autoCompleteForm = this.formBuilder.group({
            items: [[]],
            searchQuery: [null, Validators.minLength(3)],
        });
        if (this.required) {
            this.autoCompleteForm
                .get('items')
                ?.addValidators(Validators.required);
        }
        this.handleSearchQueryChanges();
        this.handleStatusChanges();
        this.handleSubmitEvent();
    }

    private handleSearchQueryChanges() {
        this.searchQuery?.valueChanges
            .pipe(
                debounceTime(250),
                switchMap((searchTerm: string | undefined) => {
                    if (typeof searchTerm === 'string' && (searchTerm?.length === 0 || searchTerm?.length > 2)) {
                        this.busy = true;
                        return this.search<Record<string, unknown>>(searchTerm);
                    }
                    return [];
                }),
                untilDestroyed(this)
            )
            .subscribe((filteredItemList: CollectionResponse<Record<string, unknown>>) => {
                    this.filteredItemList = filteredItemList.data;
                    if (this.items?.value) {
                        this.removeSelectedItemsFromFilteredItemList(
                            this.items?.value
                        );
                    }
                    this.busy = false;
                }
            );
    }

    private handleStatusChanges() {
        this.autoCompleteForm.statusChanges.subscribe((status) => {
            this.chipList.errorState = status === 'INVALID';
        });
    }

    private handleSubmitEvent() {
        if (this.submitEvent$) {
            this.submitEvent$.pipe(untilDestroyed(this)).subscribe(() => {
                this.searchQuery?.setValue(null);
                if (this.items?.value && !this.items?.value.length) {
                    this.items.setValue(null);
                }
                this.autoCompleteForm.markAllAsTouched();
            });
        }
    }

    add(event: MatAutocompleteSelectedEvent): void {
        if (event.option.value !== '') {
            let newChipList;
            if (this.items?.value?.length) {
                newChipList = this.items?.value.filter((item: { id: number }) => item.id !== event.option.value.id).concat(event.option.value);
            } else {
                newChipList = [event.option.value];
            }
            this.items?.setValue(newChipList);
            this.updateInput(this.autoCompleteForm.value);
            this.handleSearchQueryState();
            this.onTouched();
        }
    }

    remove(id: number) {
        if (this.items?.value.length) {
            const filteredList = this.items?.value.filter((item: { id: number }) => item.id !== id);
            this.items?.setValue(filteredList);
            this.resetFilteredItemList();
            this.removeSelectedItemsFromFilteredItemList(this.items?.value);
        } else {
            this.items?.setValue(null);
            this.resetFilteredItemList();
        }
        this.updateInput(this.autoCompleteForm.value)
        this.handleSearchQueryState()
        this.onTouched()
    }

    private updateInput(
        form: { items: { id: number }[]; searchQuery: string } | null
    ) {
        this.onChange(form ? form.items : null);
        this.selectedValueChange.next(form?.items);
        if (form) {
            this.removeSelectedItemsFromFilteredItemList(form.items)
        }
        this.searchQuery?.setValue(null);
        this.refInput.nativeElement.value = '';
        this.onTouched();
    }

    registerOnChange(fn: (_: { id: number }[] | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(controls?: { id: number }[] | number[]): void {
        if (controls) {
            if (!controls.length) {
                return;
            }
            this.busy = true;
            const idList: number[] = controls.map(
                (control: { id: number } | number) =>
                    typeof control == 'number' ? control : control.id
            );
            const filter: FilterModel = {
                attribute: 'id',
                type: StrapiFilterTypesEnum.IN,
                value: idList,
            };
            this.tableService
                .find<Record<string, unknown>>(
                    this.collectionName,
                    [filter],
                    this.populate,
                    this.showDrafts,
                    'asc',
                    'id',
                    0,
                    -1,
                    this.activeLang
                )
                .pipe(
                    switchMap((items: CollectionResponse<Record<string, unknown>>) => {
                        if (this.maxChipNumber) {
                            this.items?.setValue(items.data.splice(0, this.maxChipNumber));
                            if (this.items?.value.length >= this.maxChipNumber) {
                                this.searchQuery?.disable()
                            }
                        } else {
                            this.items?.setValue(items.data)
                        }
                        return this.tableService.find<Record<string, unknown>>(this.collectionName, this.filters, this.populate, this.showDrafts,'asc', 'id', 0, -1, this.activeLang)
                    }),
                    untilDestroyed(this)
                )
                .subscribe((items: CollectionResponse<Record<string, unknown>>) => {
                    this.itemList = items.data;
                    this.resetFilteredItemList();
                    this.removeSelectedItemsFromFilteredItemList(this.items?.value);
                    this.busy = false;
                });
        }
    }

    validate() {
        return this.chipList && this.chipList.errorState;
    }

    search<T>(searchQuery: string): Observable<CollectionResponse<T>> {
        const filter = {
            attribute: this.searchByAttribute,
            type: StrapiFilterTypesEnum.CONTAINS,
            value: searchQuery,
        };
        return this.tableService.find<T>(
            this.collectionName,
            [...this.filters, filter],
            this.populate,
            this.showDrafts,
            'asc',
            'id',
            0,
            -1,
            this.activeLang
        );
    }

    removeSelectedItemsFromFilteredItemList(items: { id: number }[]) {
        if (this.filteredItemList && this.filteredItemList.length) {
            this.filteredItemList = this.filteredItemList.filter(
                (item) =>
                    !items.map((item) => item.id).includes(item['id'] as number)
            );
        }
    }

    resetFilteredItemList() {
        this.filteredItemList = this.itemList;
    }

    handleSearchQueryState() {
        if (this.maxChipNumber && this.items?.value?.length >= this.maxChipNumber) {
            this.searchQuery?.disable({ emitEvent: false });
            return;
        }
        this.searchQuery?.enable({ emitEvent: false });
    }

    get searchQuery() {
        return this.autoCompleteForm.get('searchQuery');
    }

    get items() {
        return this.autoCompleteForm.get('items');
    }

    get itemValues() {
        return Array.isArray(this.items?.value) ? this.items?.value : [this.items?.value].filter(item => item);
    }
}

