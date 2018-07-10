import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasReviewComponent } from './cas-review.component';

describe('CasReviewComponent', () => {
  let component: CasReviewComponent;
  let fixture: ComponentFixture<CasReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
