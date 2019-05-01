import { TestBed } from '@angular/core/testing';

import { FmsDataService } from './fms-data.service';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';

describe('FmsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FmsDataService = TestBed.get(FmsDataService);
    expect(service).toBeTruthy();
  });

  it('FMS JSON should be present', () => {
    const service: FmsDataService = TestBed.get(FmsDataService);

    // Requires: Server to be running
    expect(service.isDataPresent).toBeTruthy();
  });

  it('should traverse FMS JSON tree successfully', () => {
    const tuples: Array<[string, number | boolean | string | Array<NameValuePair>]> = [
      ["Power/Voltage", 0],
      ["Power/Current", -0.002],
      ["Status/Flags/Adc initialized", true],
      ["status/flags/dac initialized", true],
      ["status/flags/Sensor hig initialized", true],
      ["status/flags/Gnss initialized", false],
      ["status/flight substate", 0],
      ["status/servo Pos/y", 0]
    ];

    tuples.forEach(tuple => {
      // Requires: Server to be running
      expect(FmsDataService.getValue(tuple[0]) === tuple[1]).toBeTruthy();
    });
  });
});
