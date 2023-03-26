import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityAssetsPageComponent } from './authority-assets-page.component';

describe('AuthorityAssetsPageComponent', () => {
  let component: AuthorityAssetsPageComponent;
  let fixture: ComponentFixture<AuthorityAssetsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityAssetsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityAssetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
