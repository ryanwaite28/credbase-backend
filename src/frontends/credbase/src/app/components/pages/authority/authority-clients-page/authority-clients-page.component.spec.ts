import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityClientsPageComponent } from './authority-clients-page.component';

describe('AuthorityClientsPageComponent', () => {
  let component: AuthorityClientsPageComponent;
  let fixture: ComponentFixture<AuthorityClientsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityClientsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityClientsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
