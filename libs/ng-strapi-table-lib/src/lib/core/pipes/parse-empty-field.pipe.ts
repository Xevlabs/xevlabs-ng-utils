import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
    name: 'parseEmptyField',
})
export class ParseEmptyFieldPipe implements PipeTransform {
    constructor(private translocoService: TranslocoService) {}

    transform(value: string, translate: boolean): string {
        if (!translate) {
            return '--';
        }
        const transformedValue = `${value}_empty_field`
            .replace(/([A-Z])/g, '_$1')
            .toUpperCase();
        const translation = this.translocoService.translate(transformedValue);
        return translation;
    }
}
