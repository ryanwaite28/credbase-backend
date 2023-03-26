import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityBasePageComponent } from './authority-base-page.component';

describe('AuthorityBasePageComponent', () => {
  let component: AuthorityBasePageComponent;
  let fixture: ComponentFixture<AuthorityBasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityBasePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
