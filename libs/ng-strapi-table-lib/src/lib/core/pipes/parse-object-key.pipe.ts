import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseObjectKey'
})
export class ParseObjectKeyPipe implements PipeTransform {

  transform(value: Record<string, unknown>, accessor: string): any {
    const propsToAccess = accessor.split('.');
    let accededValue = value;
    propsToAccess.forEach(prop => {
      accededValue = (accededValue ? (accededValue as Record<string, unknown>)[prop] : undefined) as Record<string, unknown>;
    });
    return accededValue;
  }

}
