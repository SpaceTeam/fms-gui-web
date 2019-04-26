import { TestBed } from '@angular/core/testing';

import { RoutesService } from './routes.service';
import {HttpClientModule} from '@angular/common/http';

describe('RoutesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: RoutesService = TestBed.get(RoutesService);
    expect(service).toBeTruthy();
  });
});
