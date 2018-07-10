import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasInfoComponent } from './cas-info.component';

describe('CasInfoComponent', () => {
  let component: CasInfoComponent;
  let fixture: ComponentFixture<CasInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
