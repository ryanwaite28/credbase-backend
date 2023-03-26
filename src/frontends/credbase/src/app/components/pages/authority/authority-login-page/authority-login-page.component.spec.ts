import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityLoginPageComponent } from './authority-login-page.component';

describe('AuthorityLoginPageComponent', () => {
  let component: AuthorityLoginPageComponent;
  let fixture: ComponentFixture<AuthorityLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityLoginPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
