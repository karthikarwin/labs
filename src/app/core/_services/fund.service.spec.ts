import { TestBed, inject } from '@angular/core/testing';

import { FundService } from './fund.service';

describe('FundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FundService]
    });
  });

  it('should be created', inject([FundService], (service: FundService) => {
    expect(service).toBeTruthy();
  }));
});
