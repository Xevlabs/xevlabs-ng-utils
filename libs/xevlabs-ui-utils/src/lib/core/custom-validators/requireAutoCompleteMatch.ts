import { AbstractControl, ValidatorFn } from "@angular/forms"

export function requireAutoCompleteMatch(validOptions: any[]): ValidatorFn {
    return (control: AbstractControl): { incorrect: boolean } | null => {
        if (validOptions?.indexOf(control.value) !== -1) {
            return null
        }
        return { incorrect: true }
    }
}