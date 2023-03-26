import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityHelpPageComponent } from './authority-help-page.component';

describe('AuthorityHelpPageComponent', () => {
  let component: AuthorityHelpPageComponent;
  let fixture: ComponentFixture<AuthorityHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityHelpPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
