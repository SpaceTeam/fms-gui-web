import { TestBed } from '@angular/core/testing';

import { FmsDataService } from './fms-data.service';

describe('FmsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FmsDataService = TestBed.get(FmsDataService);
    expect(service).toBeTruthy();
  });
});
