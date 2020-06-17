import {TestBed} from '@angular/core/testing';

import {RadarConfigService} from './radar-config.service';

describe('RadarConfigService', () => {
  let service: RadarConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadarConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
