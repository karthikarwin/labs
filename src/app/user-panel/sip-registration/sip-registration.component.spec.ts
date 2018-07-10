import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipRegistrationComponent } from './sip-registration.component';

describe('SipRegistrationComponent', () => {
  let component: SipRegistrationComponent;
  let fixture: ComponentFixture<SipRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
