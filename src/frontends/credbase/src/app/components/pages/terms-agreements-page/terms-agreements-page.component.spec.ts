import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAgreementsPageComponent } from './terms-agreements-page.component';

describe('TermsAgreementsPageComponent', () => {
  let component: TermsAgreementsPageComponent;
  let fixture: ComponentFixture<TermsAgreementsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAgreementsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAgreementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
