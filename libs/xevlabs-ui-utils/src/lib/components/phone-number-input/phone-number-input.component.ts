import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { countries } from '../../core/constants/countries';
import { phonePattern } from '../../core/custom-validators/patterns';

@Component({
    selector: 'xevlabs-ng-utils-phone-number-input',
    templateUrl: './phone-number-input.component.html',
    styleUrls: ['./phone-number-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PhoneNumberInputComponent),
        multi: true,
    },
    {
        provide: NG_VALIDATORS,
        useExisting: PhoneNumberInputComponent,
        multi: true,
    }]
})
export class PhoneNumberInputComponent implements OnInit {

    @Input() label!: string;
    countries = countries;
    phoneNumberControl!: FormControl;
    selectedCountryPhone: string = '+' + countries[0].phone.toString();

    onChange!: (value: string) => void
    onTouched!: () => void

    constructor(private formBuilder: FormBuilder) { }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    get selectedCountry() {
        return this.countries.filter(country => '+' + (country.phone) == this.selectedCountryPhone)[0]
    }

    ngOnInit() {
        this.selectedCountryPhone = localStorage.getItem('dialCode')!
        this.phoneNumberControl = this.formBuilder.control('', [Validators.required, Validators.pattern(phonePattern())])
        this.phoneNumberControl.valueChanges.subscribe((value: string) => {
            this.onChange(this.selectedCountryPhone + value)
        })
    }

    setCountryPhoneCode(selection: MatSelectChange) {
        this.selectedCountryPhone = '+' + selection.value.phone;
        localStorage.setItem('dialCode', this.selectedCountryPhone)
    }

    writeValue(value: string) {
        if (value) {
            this.phoneNumberControl.setValue(value.substring(localStorage.getItem('dialCode')?.length!), { emitEvent: false })
        }
    }

    validate() {
        return this.phoneNumberControl.invalid ? { invalid: true } : null
    }


}
