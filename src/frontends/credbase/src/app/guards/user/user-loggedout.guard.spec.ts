import { TestBed } from '@angular/core/testing';

import { UserLoggedoutGuard } from './user-loggedout.guard';

describe('UserLoggedoutGuard', () => {
  let guard: UserLoggedoutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserLoggedoutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
