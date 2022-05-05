import {Component, forwardRef, Input, OnInit} from '@angular/core'
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms'
import {MatSelectChange} from '@angular/material/select'
import {countries} from '../../core/constants/countries'
import {PhoneNumberUtil} from 'google-libphonenumber'
import { Observable } from 'rxjs'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
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
    @Input() disabled!: boolean
    @Input() submitEvent$ = new Observable<void>()
    @Input() defaultCountryCode = 'FR'
    countries = countries
    phoneNumberControl!: FormControl
    selectedCountryPhone: string = countries[0].phone.toString()
    isMobile = false

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
        return this.countries.filter((country: any) => (country.phone)==this.selectedCountryPhone)[0]
    }

    get error() {
        return !(this.getCountryCode(this.phoneNumberControl?.value).valid || this.getCountryCode(this.selectedCountryPhone + this.phoneNumberControl?.value).valid)
   }

    phoneValidator(e: PhoneNumberInputComponent) {
        return (control: AbstractControl) => {
            return e.error ? { invalid: true }:null
        }
    }

    getCountryCode(internationalNumber: string): { countryCode: string, number: string, valid: boolean } {
        let phoneNumber
        try {
            let parsedIntNumber = internationalNumber;
            if (parsedIntNumber[0] === "0") {
                parsedIntNumber = parsedIntNumber.substring(1)
            }
            phoneNumber = this.phoneUtil.parseAndKeepRawInput(parsedIntNumber[0] === '+' ? parsedIntNumber : `+${parsedIntNumber}`)
            const countryCode = phoneNumber.getCountryCode()
            const nationalNumber = phoneNumber.getNationalNumber()
            const nationalNumberString = nationalNumber ? nationalNumber.toString() : '';
            const validNumber = phoneNumber.hasNationalNumber() && nationalNumberString.length > 8
            return {
                countryCode: countryCode ? countryCode.toString():'',
                number: nationalNumberString,
                valid: validNumber,
            }
        } catch (e) {
            return {
                countryCode: '',
                number: '',
                valid: false,
            }
        }

    }

    ngOnInit() { 
        const defaultCountry = this.countries.find(country => country.code === this.defaultCountryCode) 
        if (defaultCountry) {
            if (this.countries.indexOf(defaultCountry) !== 0) {
                this.countries.splice(this.countries.indexOf(defaultCountry), 1)
                this.countries.unshift(defaultCountry)
                this.selectedCountryPhone = this.countries[0].phone.toString()
            }
        }  
        this.phoneNumberControl = this.formBuilder.control('', [Validators.required, this.phoneValidator(this)])
        this.phoneNumberControl.valueChanges.subscribe((value: string) => {
            this.updatePhoneNumber(value)
        })
        if (this.disabled)
            this.phoneNumberControl.disable({emitEvent: false})
        this.submitEvent$.pipe(untilDestroyed(this)).subscribe(() => {
            this.phoneNumberControl.markAsTouched()
        })
        if (window.screen.width <= 599) this.isMobile = true;
    }

    setCountryPhoneCode(selection: MatSelectChange) {
        this.selectedCountryPhone = selection.value.phone
        this.updatePhoneNumber(this.phoneNumberControl.value)
    }

    updatePhoneNumber(phoneNumber: string) {
        const {countryCode, number, valid} = this.getCountryCode(phoneNumber)
        const intNumber = this.getCountryCode(this.selectedCountryPhone + phoneNumber)
        if (valid && countryCode) {
            this.selectedCountryPhone = countryCode;
            this.phoneNumberControl.setValue(number, {emitEvent: false})
        } else if (phoneNumber.charAt(0) === '0') {
            phoneNumber = phoneNumber.substring(1)
        }
        if (!valid && !intNumber.valid) {
            this.phoneNumberControl.setErrors({invalid: true})
        } else {
            this.phoneNumberControl.setErrors(null)
        }
        const internationalPhoneNumber = this.selectedCountryPhone + phoneNumber
        this.onChange(internationalPhoneNumber)
    }

    writeValue(value: string) {
        if (value) {
            const {countryCode, number} = this.getCountryCode(value)
            this.selectedCountryPhone = countryCode
            this.phoneNumberControl.setValue(number, { emitEvent: false })
        }
    }

    validate() {
        return this.error ? {invalid: true} : null
    }

}
