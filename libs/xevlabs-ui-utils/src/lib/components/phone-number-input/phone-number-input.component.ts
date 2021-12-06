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

    get error() {
      return this.getCountryCode(this.phoneNumberControl.value).valid
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
        this.phoneNumberControl = this.formBuilder.control('', [Validators.required])
        this.phoneNumberControl.valueChanges.subscribe((value: string) => {
            this.updatePhoneNumber(value)
        })
    }

    setCountryPhoneCode(selection: MatSelectChange) {
        this.selectedCountryPhone = selection.value.phone
        this.updatePhoneNumber(this.phoneNumberControl.value)
    }

    updatePhoneNumber(phoneNumber: string) {
      const { countryCode, number, valid } = this.getCountryCode(phoneNumber)
      if (valid && countryCode) {
        this.selectedCountryPhone = countryCode;
        this.phoneNumberControl.setValue(number, {emitEvent: false})
      } else if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substring(1)
      }
      if (!valid) {
        this.phoneNumberControl.setErrors({invalid: true})
      } else {
        this.phoneNumberControl.setErrors(null)
      }
      const internationalPhoneNumber = this.selectedCountryPhone + phoneNumber
      this.onChange(internationalPhoneNumber)
    }

    writeValue(value: string) {
        if (value) {
            const { countryCode, number } = this.getCountryCode(value)
            this.selectedCountryPhone = countryCode
            this.phoneNumberControl.setValue(number, {emitEvent: false})
        }
    }

    validate() {
        return this.error ? { invalid: true } : null
    }

}
