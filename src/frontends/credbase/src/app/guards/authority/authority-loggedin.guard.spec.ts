import { TestBed } from '@angular/core/testing';

import { AuthorityLoggedinGuard } from './authority-loggedin.guard';

describe('AuthorityLoggedinGuard', () => {
  let guard: AuthorityLoggedinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthorityLoggedinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
