import { Pipe, PipeTransform } from '@angular/core';
import { Params } from '@angular/router';

@Pipe({
    name: 'queryParamsParser'
})
export class QueryParamsParserPipe implements PipeTransform {

    transform(queryParamProperties: string[], object: any): Params {
        let parsedParams: Params = {}
        queryParamProperties.forEach((key: string) => {
            parsedParams[key] = object[key]
        })
        return parsedParams
    }
}
