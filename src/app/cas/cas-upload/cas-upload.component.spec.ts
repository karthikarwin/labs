import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasUploadComponent } from './cas-upload.component';

describe('CasUploadComponent', () => {
  let component: CasUploadComponent;
  let fixture: ComponentFixture<CasUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
