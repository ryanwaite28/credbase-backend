import { TestBed } from '@angular/core/testing';

import { AuthorityAuthGuard } from './authority-auth.guard';

describe('AuthorityAuthGuard', () => {
  let guard: AuthorityAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthorityAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
