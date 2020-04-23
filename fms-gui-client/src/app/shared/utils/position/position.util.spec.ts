import {TestBed} from '@angular/core/testing';
import {PositionUtil} from './position.util';
import {Position} from '../../model/flight/position';

describe('PositionUtil', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('.calculateDistanceInMeters', () => {
    it('should return 0, if the positions are the same', () => {
      // Setup
      const position1 = new Position(10, 10);
      const position2 = new Position(10, 10);
      const expected = 0;

      // Execute
      const result = PositionUtil.calculateDistanceInMeters(position1, position2);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the correct distance, if the latitudes are equal but not the longitudes', () => {
      // Setup
      const position1 = new Position(-19.5, 40.5);
      const position2 = new Position(-20, 40.5);
      const expected = 42277;

      // Execute
      const result1 = PositionUtil.calculateDistanceInMeters(position1, position2);
      const result2 = PositionUtil.calculateDistanceInMeters(position2, position1);

      // Verify
      expect(result1).toEqual(expected);
      expect(result2).toEqual(expected);
    });
    it('should return the correct distance, if the longitudes are equal but not the latitudes', () => {
      // Setup
      const position1 = new Position(-20, 30.5);
      const position2 = new Position(-20, 30.7);
      const expected = 22239;

      // Execute
      const result1 = PositionUtil.calculateDistanceInMeters(position1, position2);
      const result2 = PositionUtil.calculateDistanceInMeters(position1, position2);

      // Verify
      expect(result1).toEqual(expected);
      expect(result2).toEqual(expected);
    });
    it('should return the correct distance, no matter the positions', () => {
      // Setup
      const position1 = new Position(-20, 7);
      const position2 = new Position(-18, 9);
      const expected = 312972;

      // Execute
      const result1 = PositionUtil.calculateDistanceInMeters(position1, position2);
      const result2 = PositionUtil.calculateDistanceInMeters(position1, position2);

      // Verify
      expect(result1).toEqual(expected);
      expect(result2).toEqual(expected);
    });
  });
});
