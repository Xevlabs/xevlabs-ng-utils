import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { StrapiDatasource } from "@xevlabs-ng-utils/xevlabs-strapi-table";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'xevlabs-ng-utils-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
    searchControl!: FormControl
    @Input() dataSource!: StrapiDatasource<any>;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.searchControl = this.formBuilder.control('', Validators.minLength(3))
        this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
            if (value.length > 2 || value.length === 0) {
                this.dataSource.search(value)
            }
        })

    }
}
