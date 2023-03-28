import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonAlertsFragmentComponent } from './alerts-fragment.component';

describe('CommonAlertsFragmentComponent', () => {
  let component: CommonAlertsFragmentComponent;
  let fixture: ComponentFixture<CommonAlertsFragmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAlertsFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAlertsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
