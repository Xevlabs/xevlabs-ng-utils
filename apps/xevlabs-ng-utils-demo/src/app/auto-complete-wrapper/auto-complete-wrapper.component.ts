import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'xevlabs-ng-utils-auto-complete-wrapper',
    templateUrl: './auto-complete-wrapper.component.html',
    styleUrls: ['./auto-complete-wrapper.component.scss']
})
export class AutoCompleteWrapperComponent {
    path = 'http://localhost:1337/test-collections'
    autoCompleteForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.autoCompleteForm = this.formBuilder.group({
            selectedItemId: ''
        });
    }

    get selectedItemId() {
        return this.autoCompleteForm.get('selectedItemId');
    }
}
