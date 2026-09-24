import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StrapiTableService } from './strapi-table.service';

describe('StrapiTableService', () => {
  let service: StrapiTableService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StrapiTableService,
        { provide: 'StrapiTableLibOptions', useValue: { baseUrl: 'http://localhost:1337/api', strapiVersion: 5 } },
      ],
    });
    service = TestBed.inject(StrapiTableService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should paginate with the provided page size and number', () => {
    service.find('items', [], undefined, false, 'asc', 'createdAt', 2, 25).subscribe();

    const req = httpMock.expectOne(request => request.url.startsWith('http://localhost:1337/api/items'));
    expect(req.request.params.get('pagination[limit]')).toEqual('25');
    expect(req.request.params.get('pagination[start]')).toEqual('50');
    req.flush({ data: [], meta: { pagination: { total: 0 } } });
  });

  it('should translate pageSize -1 into an explicit fetch-all limit', () => {
    service.find('items', [], undefined, false, 'asc', 'createdAt', 0, -1).subscribe();

    const req = httpMock.expectOne(request => request.url.startsWith('http://localhost:1337/api/items'));
    expect(req.request.params.get('pagination[limit]')).toEqual('1000');
    expect(req.request.params.get('pagination[start]')).toEqual('0');
    req.flush({ data: [], meta: { pagination: { total: 0 } } });
  });
});
