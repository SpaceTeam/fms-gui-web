import { TestBed } from '@angular/core/testing';

import { RadarUtil } from './radar.util';
import * as d3 from 'd3';
import {NegativeNumberException} from '../../../exceptions/negative-number.exception';
import {Point} from '../../../model/point.model';

describe('RadarUtil', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('calculateEquidistantCircleRadii', () => {
    it('should return the correct radii for any given number of circles', () => {
      // Setup
      let numOfCircles = 5;
      let expected = [10, 20, 30, 40, 50];

      // Execute
      let result = RadarUtil.calculateEquidistantCircleRadii(numOfCircles);

      // Evaluate
      expect(result).toEqual(expected);

      // Setup
      numOfCircles = 8;
      expected = [6.25, 12.5, 18.75, 25, 31.25, 37.5, 43.75, 50];

      // Execute
      result = RadarUtil.calculateEquidistantCircleRadii(numOfCircles);

      // Evaluate
      expect(result).toEqual(expected);

      // Setup
      numOfCircles = 20;
      expected = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45, 47.5, 50];

      // Execute
      result = RadarUtil.calculateEquidistantCircleRadii(numOfCircles);

      // Evaluate
      expect(result).toEqual(expected);

      // Setup
      numOfCircles = 0;
      expected = [];

      // Execute
      result = RadarUtil.calculateEquidistantCircleRadii(numOfCircles);

      // Evaluate
      expect(result).toEqual(expected);
    });
    it('should return an error for a negative number of circles', () => {
      // Setup
      const numOfCircles = -1;

      // No execution, direct verification
      expect(() => RadarUtil.calculateEquidistantCircleRadii(numOfCircles))
        .toThrow(new NegativeNumberException('No negative numbers allowed'));
    });
  });
  describe('scaleToSquare', () => {
    const id = 'div';
    const selector = `#${id}`;

    beforeAll(() => {
      const div = document.createElement('div');
      div.id = id;
      document.body.appendChild(div);
    });

    afterAll(() => {
      document.body.removeChild(document.getElementById(id));
    });

    it('should equal the width and height values of an object with the longer side', () => {
      // Setup
      const longerSide = 200;
      const shorterSide = 100;
      const expected = `${longerSide}px`;

      d3.select(selector)
        .style('width', `${longerSide}px`)
        .style('height', `${shorterSide}px`);

      // Execute
      RadarUtil.scaleToSquare(selector, longerSide);

      // Verify
      const width = d3.select(selector).style('width');
      const height = d3.select(selector).style('height');

      expect(width).toEqual(expected);
      expect(height).toEqual(expected);
    });
    it('should equal the width and height values of an object with the shorter side', () => {
      // Setup
      const longerSide = 200;
      const shorterSide = 100;
      const expected = `${shorterSide}px`;

      d3.select(selector)
        .style('width', `${shorterSide}px`)
        .style('height', `${longerSide}px`);

      // Execute
      RadarUtil.scaleToSquare(selector, shorterSide);

      // Verify
      const width = d3.select(selector).style('width');
      const height = d3.select(selector).style('height');

      expect(width).toEqual(expected);
      expect(height).toEqual(expected);
    });
    it('should do nothing, if we already have a square object', () => {
      // Setup
      const side = 200;
      const expected = `${side}px`;

      d3.select(selector)
        .style('width', `${side}px`)
        .style('height', `${side}px`);

      // Execute
      RadarUtil.scaleToSquare(selector, side);

      // Verify
      const width = d3.select(selector).style('width');
      const height = d3.select(selector).style('height');

      expect(width).toEqual(expected);
      expect(height).toEqual(expected);
    });
  });
  describe('getRadarSize', () => {
    const id = 'div';
    const selector = `#${id}`;

    beforeAll(() => {
      const div = document.createElement('div');
      div.id = id;
      document.body.appendChild(div);
    });

    afterAll(() => {
      document.body.removeChild(document.getElementById(id));
    });

    it('should return the width of an object, if the width is smaller than the height', () => {
      // Setup
      const width = 200;
      const height = 400;
      const expected = width;

      d3.select(selector)
        .style('width', `${width}px`)
        .style('height', `${height}px`);

      // Execute
      const result = RadarUtil.getMinimumSideLength(selector);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the height of an object, if the height is smaller than the width', () => {
      // Setup
      const width = 400;
      const height = 200;
      const expected = height;

      d3.select(selector)
        .style('width', `${width}px`)
        .style('height', `${height}px`);

      // Execute
      const result = RadarUtil.getMinimumSideLength(selector);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should return the width or height of an object, if the object is a square', () => {
      // Setup
      const expected = 400;

      d3.select(selector)
        .style('width', `${expected}px`)
        .style('height', `${expected}px`);

      // Execute
      const result = RadarUtil.getMinimumSideLength(selector);

      // Verify
      expect(result).toEqual(expected);
    });
  });
  describe('adjustDomain', () => {
    it('should do nothing, if the new position is inside the domain', () => {
      // Setup
      const radius = 50;
      const max = 100;
      const numOfCircles = 5;
      const multiplier = 10;
      const expected = max;

      // Execute
      const result = RadarUtil.getNewDomainMax(radius, max, numOfCircles, multiplier);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should adjust the domain, if the new position is too close to the center', () => {
      // Setup
      const radius = 8;
      const max = 100;
      const numOfCircles = 5;
      const multiplier = 10;
      const expected = max / multiplier; // in this case simply 10

      // Execute
      const result = RadarUtil.getNewDomainMax(radius, max, numOfCircles, multiplier);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should adjust the domain, if the new position is outside of the range', () => {
      // Setup
      const radius = 110;
      const max = 100;
      const numOfCircles = 5;
      const multiplier = 10;
      const expected = max * multiplier;  // In this case simply 1000

      // Execute
      const result = RadarUtil.getNewDomainMax(radius, max, numOfCircles, multiplier);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should adjust the domain as long as the new position is too close to the center', () => {
      // Setup
      const radius = 8;
      const max = 1000;
      const numOfCircles = 5;
      const multiplier = 10;
      const expected = max / Math.pow(multiplier, 2); // in this case simply 10 (first scale down to 100, then to 10)

      // Execute
      const result = RadarUtil.getNewDomainMax(radius, max, numOfCircles, multiplier);

      // Verify
      expect(result).toEqual(expected);
    });
    it('should adjust the domain as long as the new position is too close to the center', () => {
      // Setup
      const radius = 20000;
      const max = 100;
      const numOfCircles = 5;
      const multiplier = 10;
      const expected = max * Math.pow(multiplier, 3); // in this case simply 100000 (first scale up to 1000, then 10000, and 10000)

      // Execute
      const result = RadarUtil.getNewDomainMax(radius, max, numOfCircles, multiplier);

      // Verify
      expect(result).toEqual(expected);
    });
  });
  describe('getPositionOnRadar', () => {
    // We need this epsilon because some results are very close and this is enough for us (e.g. 49.99999 and 50)
    const epsilon = 0.00001;

    it('returns the correct position for a vector with only one positive x value', () => {
      // Setup
      const direction = new Point(1, 0);
      let factor = 1;
      let expected = new Point(100, 50);

      // Execute
      let result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);

      // Setup
      factor = 0.5;
      expected = new Point(75, 50);

      // Execute
      result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);
    });
    it('returns the correct position for a vector with only one positive y value', () => {
      // Setup
      const direction = new Point(0, 1);
      let factor = 1;
      let expected = new Point(50, 0);

      // Execute
      let result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);

      // Setup
      factor = 0.2;
      expected = new Point(50, 40);

      // Execute
      result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);
    });
    it('returns the correct position for a vector with only one negative x value', () => {
      // Setup
      const direction = new Point(-1, 0);
      let factor = 1;
      let expected = new Point(0, 50);

      // Execute
      let result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);

      // Setup
      factor = 0.3;
      expected = new Point(35, 50);

      // Execute
      result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);
    });
    it('returns the correct position for a vector with only one negative y value', () => {
      // Setup
      const direction = new Point(0, -1);
      let factor = 1;
      let expected = new Point(50, 100);

      // Execute
      let result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);

      // Setup
      factor = 0.4;
      expected = new Point(50, 70);

      // Execute
      result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);
    });
    it('returns the correct position for a vector with arbitrary values', () => {
      // Setup
      const direction = new Point(0.5, 0.5);
      const dx = Math.cos(Math.PI * 0.25);
      const dy = Math.sin(Math.PI * 0.25);
      let factor = 1;
      let expected = new Point(50 * (1 + dx * factor), 50 * (1 - dy * factor));

      // Execute
      let result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);

      // Setup
      factor = 0.4;
      expected = new Point(50 * (1 + dx * factor), 50 * (1 - dy * factor));

      // Execute
      result = RadarUtil.getPositionOnRadar(direction, factor);

      // Verify
      expect(result.x).toBeCloseTo(expected.x, epsilon);
      expect(result.y).toBeCloseTo(expected.y, epsilon);
    });
  });
});
