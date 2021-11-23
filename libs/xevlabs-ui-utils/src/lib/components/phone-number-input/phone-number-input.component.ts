import { Component, forwardRef, Input, OnInit } from '@angular/core'
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms'
import { MatSelectChange } from '@angular/material/select'
import { countries } from '../../core/constants/countries'
import { phonePattern } from '../../core/custom-validators/patterns'
import { PhoneNumberUtil } from 'google-libphonenumber'

@Component({
    selector: 'xevlabs-ng-utils-phone-number-input',
    templateUrl: './phone-number-input.component.html',
    styleUrls: ['./phone-number-input.component.scss'],
    providers: [
        PhoneNumberUtil,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneNumberInputComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: PhoneNumberInputComponent,
            multi: true,
        }],
})
export class PhoneNumberInputComponent implements OnInit, ControlValueAccessor {

    @Input() label!: string
    countries = countries
    phoneNumberControl!: FormControl
    selectedCountryPhone: string = countries[0].phone.toString()

    onChange!: (value: string) => void
    onTouched!: () => void

    constructor(private formBuilder: FormBuilder, private phoneUtil: PhoneNumberUtil) {
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    get selectedCountry() {
        return this.countries.filter((country: any) => (country.phone) == this.selectedCountryPhone)[0]
    }

    getCountryCode(internationalNumber: string): { countryCode: string, number: string, valid: boolean } {
        let phoneNumber;
        try {
            phoneNumber = this.phoneUtil.parseAndKeepRawInput(internationalNumber[0] === '+' ? internationalNumber : `+${internationalNumber}`)
            const countryCode = phoneNumber.getCountryCode()
            const nationalNumber = phoneNumber.getNationalNumber()
            const nationalNumberString = nationalNumber ? nationalNumber.toString() : ''
            const validNumber = phoneNumber.hasNationalNumber() && nationalNumberString.length > 8
            return {
                countryCode: countryCode ? countryCode.toString() : '',
                number: nationalNumberString,
                valid: validNumber
            }
        } catch (e) {
            return {
                countryCode: '',
                number: '',
                valid: false
            }
        }

    }


    ngOnInit() {
        this.phoneNumberControl = this.formBuilder.control('', [Validators.required, Validators.pattern(phonePattern())])
        this.phoneNumberControl.valueChanges.subscribe((value: string) => {
            const { countryCode, number, valid } = this.getCountryCode(value)
            if (valid && countryCode) {
                this.selectedCountryPhone = countryCode;
                this.phoneNumberControl.setValue(number, {emitEvent: false})
            }
            const internationalPhoneNumber = this.selectedCountryPhone + value
            this.onChange(internationalPhoneNumber)
        })
    }

    setCountryPhoneCode(selection: MatSelectChange) {
        this.selectedCountryPhone = selection.value.phone
        localStorage.setItem('dialCode', this.selectedCountryPhone)
    }

    writeValue(value: string) {
        if (value) {
            const { countryCode, number } = this.getCountryCode(value)
            this.selectedCountryPhone = countryCode
            this.phoneNumberControl.setValue(number, {emitEvent: false})
        }
    }

    validate() {
        return this.phoneNumberControl.invalid ? { invalid: true } : null
    }

}
