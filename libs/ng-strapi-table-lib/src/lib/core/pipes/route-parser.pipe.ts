import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'routeParser'
})
export class RouteParserPipe implements PipeTransform {

    transform(value: string, propertyKey: string, propertyValue: any): string {
        const parsedRoute = value.replace(':' + propertyKey, propertyValue.toString()) 
        return parsedRoute;
    }

}
