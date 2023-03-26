import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritySettingsPageComponent } from './authority-settings-page.component';

describe('AuthoritySettingsPageComponent', () => {
  let component: AuthoritySettingsPageComponent;
  let fixture: ComponentFixture<AuthoritySettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthoritySettingsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthoritySettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
