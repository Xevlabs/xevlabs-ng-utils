import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
    selector: 'xevlabs-ng-utils-auto-complete-wrapper',
    templateUrl: './auto-complete-wrapper.component.html',
    styleUrls: ['./auto-complete-wrapper.component.scss']
})
export class AutoCompleteWrapperComponent implements OnInit {
    public path = environment.baseUrl
    autoCompleteForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { 
        this.autoCompleteForm = this.formBuilder.group({
            selectedId: ''
        });
    }
    
    get selectedId() {
        return this.autoCompleteForm.get('selectedId')
    }

    ngOnInit(): void {
    }

}
