import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityHomePageComponent } from './authority-home-page.component';

describe('AuthorityHomePageComponent', () => {
  let component: AuthorityHomePageComponent;
  let fixture: ComponentFixture<AuthorityHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityHomePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
