import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'any'
})
export class ItemListService {

    constructor(private httpClient: HttpClient) { }

    retrieveList(path: string) {
        return this.httpClient.get<any>(path)
            .pipe(map((response: any) => {
                return response;
            }));

    }
    getById(path: string, id: number) {
        return this.httpClient.get<any>(path+ '/' + id)
            .pipe(map((response: any) => {
                return response;
            }));

    }
}
