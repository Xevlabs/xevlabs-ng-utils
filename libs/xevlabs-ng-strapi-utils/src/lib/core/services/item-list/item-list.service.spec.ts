import { TestBed } from '@angular/core/testing';

import { ItemListService } from './item-list.service';

describe('RetrieveListService', () => {
  let service: ItemListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
