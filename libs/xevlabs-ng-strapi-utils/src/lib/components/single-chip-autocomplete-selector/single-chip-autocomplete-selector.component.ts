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
import { Observable, Subscription } from 'rxjs';
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
    selector: 'xevlabs-ng-utils-single-chip-autocomplete-selector',
    templateUrl: './single-chip-autocomplete-selector.component.html',
    styleUrls: ['./single-chip-autocomplete-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(
                () => SingleChipAutocompleteSelectorComponent
            ),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: SingleChipAutocompleteSelectorComponent,
            multi: true,
        },
        StrapiTableService,
    ],
})
export class SingleChipAutocompleteSelectorComponent implements OnInit, ControlValueAccessor, OnChanges
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
    @Input() initList = true;

    itemListSubscription!: Subscription;
    activeLang?: string;
    filteredItemList: Record<string, unknown>[] = [];
    busy!: boolean;
    autoCompleteForm!: FormGroup;

    onChange!: (_: { id: number } | null) => void;
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
              this.autoCompleteForm?.get('item')?.addValidators(Validators.required);
          } else {
              this.autoCompleteForm?.get('item')?.removeValidators(Validators.required);
          }
      }
  }

    ngOnInit() {
        this.customLocale ? this.customLocale : this.translocoService.getActiveLang();
        this.autoCompleteForm = this.formBuilder.group({
            item: [null, this.required ? Validators.required : null],
            searchQuery: ['', Validators.minLength(3)],
        });
        if (this.required) {
            this.autoCompleteForm
                .get('item')
                ?.addValidators(Validators.required);
        }
        this.initItemList();
        this.handleSearchQueryChanges();
        this.handleStatusChanges();
        this.handleSubmitEvent();
    }

    private initItemList() {
        this.busy = true;
        this.itemListSubscription?.unsubscribe();
        if (this.initList) {
            this.itemListSubscription = this.tableService.find<Record<string, unknown>>(this.collectionName, this.filters, this.populate, this.showDrafts,'asc', 'id', 0, -1, this.activeLang)
                .pipe(untilDestroyed(this))
                .subscribe((items: CollectionResponse<Record<string, unknown>>) => {
                    this.filteredItemList = items.data;
                    this.busy = false;
                })
        }
    }

    private handleSearchQueryChanges() {
        this.searchQuery?.valueChanges
            .pipe(
                debounceTime(250),
                switchMap((searchTerm: string | undefined) => {
                    if (typeof searchTerm === 'string' && (searchTerm?.length > 2 || this.initList)) {
                        this.busy = true;
                        return this.search<Record<string, unknown>>(searchTerm);
                    }
                    return [];
                }),
                untilDestroyed(this)
            )
            .subscribe(
                (
                    filteredItemList: CollectionResponse<
                        Record<string, unknown>
                    >
                ) => {
                    this.filteredItemList = filteredItemList.data;
                    if (this.item?.value) {
                        this.removeSelectedItemFromFilteredItemList(
                            this.item.value
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
                if (this.item?.value) {
                    this.item.setValue(null);
                }
                this.autoCompleteForm.markAllAsTouched();
            });
        }
    }

    add(event: MatAutocompleteSelectedEvent): void {
        if (event.option.value !== '') {
            this.item?.setValue(event.option.value);
            this.searchQuery?.setValue(null);
            this.refInput.nativeElement.value = '';
            this.updateInput(this.item?.value);
            this.handleSearchQueryState();
            this.onTouched();
        }
    }

    remove() {
        this.item?.setValue(null);
        this.updateInput(null);
        this.handleSearchQueryState();
        this.onTouched();
    }

    private updateInput(item: { id: number } | null) {
        this.onChange(item);
        this.selectedValueChange.next(item);
        this.onTouched();
    }

    registerOnChange(fn: (_: { id: number } | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(controls?: { id: number }): void {
        if (controls) {
            this.busy = true;
            const filter: FilterModel = {
                attribute: 'id',
                type: StrapiFilterTypesEnum.EQUAL,
                value: controls.id,
            };
            this.itemListSubscription?.unsubscribe();
            this.itemListSubscription = this.tableService
                .find(
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
                .pipe(untilDestroyed(this))
                .subscribe((response) => {
                    if (response.data.length) {
                        this.item?.setValue(response.data[0]);
                        this.searchQuery?.setValue('');
                        this.searchQuery?.disable()
                    }
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

    removeSelectedItemFromFilteredItemList(selectedItem: { id: number }) {
        this.filteredItemList = this.filteredItemList.filter(
            (item) => item !== selectedItem
        );
    }

    handleSearchQueryState() {
        if (this.item?.value) {
            this.searchQuery?.disable({ emitEvent: false })
            return
        }
        this.searchQuery?.enable({ emitEvent: false });
    }

    get searchQuery() {
        return this.autoCompleteForm.get('searchQuery');
    }

    get item() {
        return this.autoCompleteForm.get('item');
    }
}
