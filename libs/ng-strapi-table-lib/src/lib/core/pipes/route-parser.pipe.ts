import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'routeParser'
})
export class RouteParserPipe implements PipeTransform {

    transform(value: string, id: any): string {
        const parsedRoute = value.replace(':id', id.toString()) 
        return parsedRoute;
    }

}
