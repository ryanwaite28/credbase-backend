import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthoritiesPageComponent } from './user-authorities-page.component';

describe('UserAuthoritiesPageComponent', () => {
  let component: UserAuthoritiesPageComponent;
  let fixture: ComponentFixture<UserAuthoritiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAuthoritiesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAuthoritiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
