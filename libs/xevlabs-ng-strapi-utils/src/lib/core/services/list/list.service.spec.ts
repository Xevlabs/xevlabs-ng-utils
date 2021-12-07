import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgStrapiTableLibModule, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';

import { ListService } from './list.service';

describe('ListService', () => {
    let service: ListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgStrapiTableLibModule.forRoot({ baseUrl: 'https://mock.data' }),
            ], providers: [StrapiTableService]
        });
        service = TestBed.inject(ListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
