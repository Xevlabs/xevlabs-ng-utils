import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'formControl'
})
export class FormControlPipe implements PipeTransform {

  transform(value: string, formGroup: FormGroup): FormControl {
    return formGroup.get(value) as FormControl;
  }

}
