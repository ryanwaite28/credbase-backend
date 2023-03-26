import { TestBed } from '@angular/core/testing';

import { UserLoggedinGuard } from './user-loggedin.guard';

describe('UserLoggedinGuard', () => {
  let guard: UserLoggedinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserLoggedinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
