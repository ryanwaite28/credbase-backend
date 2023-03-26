import { TestBed } from '@angular/core/testing';

import { AuthorityLoggedoutGuard } from './authority-loggedout.guard';

describe('AuthorityLoggedoutGuard', () => {
  let guard: AuthorityLoggedoutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthorityLoggedoutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
