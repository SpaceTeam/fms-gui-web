import {TestBed} from '@angular/core/testing';
import {PositionUtil} from './position.util';
import {Position} from '../../model/flight/position';
import {Point} from '../../model/point.model';

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
  describe('.getNormalizedDirection', () => {
    it('should return the null vector, if start and end are the same', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(50, 15);
      const expected = new Point(0, 0);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return a normalized vector, with only a positive x coordinate, if the end is to the East', () => {
    // Setup
      const start = new Position(50, 15);
      const end = new Position(60, 15);
      const expected = new Point(1, 0);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return a normalized vector, with only a negative x coordinate, if the end is to the West', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(40, 15);
      const expected = new Point(-1, 0);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return a normalized vector, with only a positive y coordinate, if the end is to the North', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(50, 20);
      const expected = new Point(0, 1);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return a normalized vector, with only a negative y coordinate, if the end is to the South', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(50, 10);
      const expected = new Point(0, -1);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the correct normalized vector, if the end position is NorthEast from the start position', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(54, 18);
      const expected = new Point(0.8, 0.6);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the correct normalized vector, if the end position is NorthWest from the start position', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(48, 23);
      const expected = new Point(-0.243, 0.97);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the correct normalized vector, if the end position is SouthEast from the start position', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(63, 8);
      const expected = new Point(0.88, -0.474);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the correct normalized vector, if the end position is SouthWest from the start position', () => {
      // Setup
      const start = new Position(50, 15);
      const end = new Position(48, 3);
      const expected = new Point(-0.164, -0.986);

      // Execute
      const result = PositionUtil.getNormalizedDirection(start, end);

      // Verify
      expect(result).toEqual(expected);
    });
  });
});
