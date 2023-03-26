import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityNotificationsPageComponent } from './authority-notifications-page.component';

describe('AuthorityNotificationsPageComponent', () => {
  let component: AuthorityNotificationsPageComponent;
  let fixture: ComponentFixture<AuthorityNotificationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityNotificationsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityNotificationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
