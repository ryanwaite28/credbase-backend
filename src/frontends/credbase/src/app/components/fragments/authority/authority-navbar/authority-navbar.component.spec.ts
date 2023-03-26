import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityNavbarComponent } from './authority-navbar.component';

describe('AuthorityNavbarComponent', () => {
  let component: AuthorityNavbarComponent;
  let fixture: ComponentFixture<AuthorityNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
