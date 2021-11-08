import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FilterModel, StrapiFilterTypesEnum, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';


@Component({
    selector: 'xevlabs-ng-utils-auto-complete-selector',
    templateUrl: './auto-complete-selector.component.html',
    styleUrls: ['./auto-complete-selector.component.scss'],

    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutoCompleteSelectorComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: AutoCompleteSelectorComponent,
        multi: true
    },
        StrapiTableService
    ]
})
export class AutoCompleteSelectorComponent implements OnInit {

    itemList: any[] = [];
    filteredItemList: any[] = [];
    busy = true;
    @Input() path: any;
    @Input() filters: FilterModel[] = [];
    @Input() collectionName: any;
    @Input() prefix: any;
    @Input() searchByAttribute: any;
    autoCompleteForm: FormGroup;
    @ViewChild('refInput', { static: true }) refInput!: ElementRef<HTMLInputElement>;
    @ViewChild('chipList', { static: false }) chipList: any;

    constructor(
        private formBuilder: FormBuilder,
        private tableService: StrapiTableService
    ) {
        this.autoCompleteForm = this.formBuilder.group({
            item: ['', Validators.required],
            searchQuery: ''
        });

    }

    get searchQuery() {
        return this.autoCompleteForm.get('searchQuery');
    }

    get item() {
        return this.autoCompleteForm.get('item');
    }

    onTouched = () => { };

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onChange = (_: string) => {
    };

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    ngOnInit() {
        this.tableService.find(this.collectionName, this.filters).subscribe((items: any) => {
            this.filteredItemList = items
            this.busy = false
        })
        if (this.searchQuery) {
            this.searchQuery.valueChanges.pipe(
                debounceTime(250),
                switchMap((searchTerm: string) => {
                    if (typeof searchTerm === 'string') {
                        this.busy = true
                        return this.search(searchTerm);
                    }
                    return [];
                })).subscribe((filteredItemList: any) => {
                    this.filteredItemList = filteredItemList
                    this.busy = false
                });
        }
    }

    updateInput(form: { item: any, searchQuery: string } | null) {
        this.onChange(form?.item.id);
        this.onTouched();
    }

    remove() {
        this.item?.setValue(null);
        this.updateInput(null)
        this.searchQuery?.enable();
    }

    add(event: MatAutocompleteSelectedEvent): void {
        if (event.option.value !== '') {
            this.item?.setValue(event.option.value);
            this.searchQuery?.setValue(null);
            this.refInput.nativeElement.value = '';
            this.updateInput(this.autoCompleteForm.value);
            this.searchQuery?.disable();
        }
    }

    writeValue(controls?: any): void {
        if (controls) {
            this.busy = true
            const filter = { attribute: 'id', type: StrapiFilterTypesEnum.EQUAL, value: controls }
            this.tableService.find(this.collectionName, [filter]).subscribe((item: any[]) => {
                this.item?.setValue(item[0]);
                this.searchQuery?.setValue('');
                this.updateInput(this.autoCompleteForm.value);
                this.searchQuery?.disable();
                this.busy = false
            })
        }
        return;
    }

    validate() {
        return this.item?.invalid ? { invalid: true } : null
    }

    search(searchQuery: string): Observable<any> {
        const filter = { attribute: this.searchByAttribute, type: StrapiFilterTypesEnum.CONTAINS, value: searchQuery?.toLowerCase() }
        return this.tableService.find(this.collectionName, [...this.filters, filter])
    }

}
