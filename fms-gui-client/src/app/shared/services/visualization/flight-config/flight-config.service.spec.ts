import { TestBed } from '@angular/core/testing';

import { FlightConfigService } from './flight-config.service';

describe('FlightConfigService', () => {
  let service: FlightConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
