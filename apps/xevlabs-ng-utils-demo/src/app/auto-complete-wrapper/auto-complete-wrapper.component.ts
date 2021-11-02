import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { autoCompleteLinkPath } from '../core/test-variables';

@Component({
    selector: 'xevlabs-ng-utils-auto-complete-wrapper',
    templateUrl: './auto-complete-wrapper.component.html',
    styleUrls: ['./auto-complete-wrapper.component.scss']
})
export class AutoCompleteWrapperComponent {
    path = autoCompleteLinkPath;
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
