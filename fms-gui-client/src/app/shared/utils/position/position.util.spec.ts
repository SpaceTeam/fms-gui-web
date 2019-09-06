import { TestBed } from '@angular/core/testing';
import {PositionUtil} from './position.util';

describe('WebSocketUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PositionUtil = TestBed.get(PositionUtil);
    expect(service).toBeTruthy();
  });
});
