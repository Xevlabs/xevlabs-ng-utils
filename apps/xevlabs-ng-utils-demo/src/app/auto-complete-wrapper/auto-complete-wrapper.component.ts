import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
    selector: 'xevlabs-ng-utils-auto-complete-wrapper',
    templateUrl: './auto-complete-wrapper.component.html',
    styleUrls: ['./auto-complete-wrapper.component.scss']
})
export class AutoCompleteWrapperComponent {
    public path = environment.baseUrl
    autoCompleteForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { 
        this.autoCompleteForm = this.formBuilder.group({
            selectedItem: '',
            selectedSingleItem: '',
            selectedMultipleItems: [],
        });
    }
    
    get selectedItem() {
        return this.autoCompleteForm.get('selectedItem')
    }

    get selectedSingleItem() {
        return this.autoCompleteForm.get('selectedSingleItem')
    }

    get selectedMultipleItems() {
        return this.autoCompleteForm.get('selectedMultipleItems')
    }
}
