import { TestBed } from '@angular/core/testing';

import { AuthorityStoreService } from './authority-store.service';

describe('AuthorityStoreService', () => {
  let service: AuthorityStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorityStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
