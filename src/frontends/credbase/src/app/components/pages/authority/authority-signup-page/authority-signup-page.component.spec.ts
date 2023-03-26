import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritySignupPageComponent } from './authority-signup-page.component';

describe('AuthoritySignupPageComponent', () => {
  let component: AuthoritySignupPageComponent;
  let fixture: ComponentFixture<AuthoritySignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthoritySignupPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthoritySignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
