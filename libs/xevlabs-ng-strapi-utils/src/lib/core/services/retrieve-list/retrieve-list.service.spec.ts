import { TestBed } from '@angular/core/testing';

import { RetrieveListService } from './retrieve-list.service';

describe('RetrieveListService', () => {
  let service: RetrieveListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
