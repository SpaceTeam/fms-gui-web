import { TestBed } from '@angular/core/testing';

import { CellService } from './cell.service';

describe('CellService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CellService = TestBed.get(CellService);
    expect(service).toBeTruthy();
  });
});
