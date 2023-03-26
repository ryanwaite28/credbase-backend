import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityItemsPageComponent } from './authority-items-page.component';

describe('AuthorityItemsPageComponent', () => {
  let component: AuthorityItemsPageComponent;
  let fixture: ComponentFixture<AuthorityItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityItemsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
