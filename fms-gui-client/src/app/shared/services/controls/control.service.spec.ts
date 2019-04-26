import { TestBed } from '@angular/core/testing';

import { ControlService } from './control.service';
import {HttpClientModule} from '@angular/common/http';

describe('ControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: ControlService = TestBed.get(ControlService);
    expect(service).toBeTruthy();
  });
});
