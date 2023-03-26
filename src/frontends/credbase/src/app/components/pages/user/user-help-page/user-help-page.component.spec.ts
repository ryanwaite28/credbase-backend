import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHelpPageComponent } from './user-help-page.component';

describe('UserHelpPageComponent', () => {
  let component: UserHelpPageComponent;
  let fixture: ComponentFixture<UserHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
