import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'routeParser'
})
export class RouteParserPipe implements PipeTransform {

    transform(route: string, object: any): string {
        let parsedRoute = route
        const keys: string[] = this.retrieveRouteKeys(route)
        keys.map((key: string) => {
            parsedRoute = parsedRoute.replace(key, object[key.replace(':', '')])
        })
        return parsedRoute;
    }

    private retrieveRouteKeys(route: string): string[] {
        const keyRegex = `:[a-zA-Z]*`
        const keys: string[] = route.split('/');
        return keys.filter((key) => key.match(keyRegex))
    }

}
