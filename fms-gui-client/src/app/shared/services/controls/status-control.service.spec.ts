import { TestBed } from '@angular/core/testing';

import { StatusControlService } from './status-control.service';

describe('StatusControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusControlService = TestBed.get(StatusControlService);
    expect(service).toBeTruthy();
  });
});
