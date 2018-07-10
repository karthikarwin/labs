import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysPlansComponent } from './sys-plans.component';

describe('SysPlansComponent', () => {
  let component: SysPlansComponent;
  let fixture: ComponentFixture<SysPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
