import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RetrieveListService } from '../../core/services/retrieve-list/retrieve-list.service';

@Component({
    selector: 'xevlabs-ng-utils-auto-complete-selector',
    templateUrl: './auto-complete-selector.component.html',
    styleUrls: ['./auto-complete-selector.component.css'],

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
        RetrieveListService
    ]
})
export class AutoCompleteSelectorComponent implements OnInit {

    itemList: any[] = [];
    filteredItemList: Observable<any[]> = new Observable<any[]>();
    @Input() path: any;
    @Input() prefix: any;
    @Input() required = false;
    autoCompleteForm: FormGroup;
    @ViewChild('refInput', { static: true }) refInput!: ElementRef<HTMLInputElement>;
    @ViewChild('chipList', { static: false }) chipList: any;

    constructor(private formBuilder: FormBuilder, private itemListService: RetrieveListService) {
        this.autoCompleteForm = this.formBuilder.group({
            item: ['', Validators.required],
            searchQuery: ''
        });
        this.itemListService.retrieveList(this.path).subscribe((items: any) => {
            this.itemList = items
        })
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
        if (this.searchQuery) {
            this.filteredItemList = this.searchQuery.valueChanges.pipe(
                map((searchTerm: string) => {
                    if (typeof searchTerm === 'string') {
                        return this.search(searchTerm);
                    }
                    return [];
                }));
        }
        this.autoCompleteForm.statusChanges.subscribe((status: any) => {
            this.chipList.errorState = status === 'INVALID'
        })
    }

    updateInput(form: { object: any, searchQuery: string } | null) {
        this.onChange(form?.object.id);
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
            this.chipList.errorState = !this.item?.value.uid;
            this.updateInput(this.autoCompleteForm.value);
            this.searchQuery?.disable();
        }
    }

    writeValue(controls?: number): void {
        if (controls) {
            this.itemListService.getById(this.path, controls).subscribe((item: any) => {
                this.item?.setValue(item);
                this.searchQuery?.setValue('');
                this.updateInput(this.autoCompleteForm.value);
                this.searchQuery?.disable();
            })
        }
        return;
    }

    validate({ value }: FormControl) {
        const isNotValid = (this.chipList && this.chipList.errorState);
        return isNotValid && {
            invalid: true
        };
    }

    search(searchQuery: string): any[] {
        return this.itemList.filter((item: any) => {
            return (item.name).toLowerCase().includes(searchQuery ? searchQuery.toLowerCase() : '');
        });
    }

}
