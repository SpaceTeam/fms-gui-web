import { TestBed } from '@angular/core/testing';

import { ControlService } from './status-control.service';

describe('ControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControlService = TestBed.get(ControlService);
    expect(service).toBeTruthy();
  });
});