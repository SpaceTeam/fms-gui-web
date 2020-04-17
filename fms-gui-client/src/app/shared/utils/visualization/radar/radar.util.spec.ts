import { TestBed } from '@angular/core/testing';

import { RadarUtil } from './radar.util';

describe('RadarUtil', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

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
  });
});
