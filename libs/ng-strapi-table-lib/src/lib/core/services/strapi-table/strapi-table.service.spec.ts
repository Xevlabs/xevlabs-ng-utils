import { TestBed } from '@angular/core/testing';

import { StrapiTableService } from './strapi-table.service';

describe('StrapiTableService', () => {
  let service: StrapiTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrapiTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
