import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityFooterComponent } from './authority-footer.component';

describe('AuthorityFooterComponent', () => {
  let component: AuthorityFooterComponent;
  let fixture: ComponentFixture<AuthorityFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
