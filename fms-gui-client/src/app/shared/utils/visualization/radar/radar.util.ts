import * as d3 from 'd3';
import {NegativeNumberException} from '../../../exceptions/negative-number.exception';
import {Point} from '../../../model/point.model';
import {AxisEnum} from '../../../enums/axis.enum';
import {PositionUtil} from '../../position/position.util';
import {tick} from '@angular/core/testing';

export namespace RadarUtil {

  /**
   * Calculates the radii for the correct drawing of the equidistant circles
   * Works only with positive numbers (zero will return an empty array)
   * @param numOfCircles a positive integer, indicating how many equidistant circles should be displayed
   * @throws {NegativeNumberException}, if a negative number was provided
   */
  export function calculateEquidistantCircleRadii(numOfCircles: number): Array<number> {
    if (numOfCircles < 0) {
      throw new NegativeNumberException('No negative numbers allowed');
    }

    const circleRadii = [];

    // We use 50, since we only need the radius and not the diameter (50%)
    const r = 50 / numOfCircles;
    for (let i = 1; i <= numOfCircles; i++) {
      circleRadii[i - 1] = r * i;
    }
    return circleRadii;
  }

  /**
   * Calculates the background color (fill) for each of the equidistant circles
   * @param index the index of the equidistant circle
   * @param numOfCircles a positive integer, indicating how many equidistant circles should be displayed
   */
  export function calculateCircleFill(index: number, numOfCircles: number): string {
    const colorNumberInterpolate = d3.interpolateNumber(0.1, 0.7);
    return d3.interpolateGreys(colorNumberInterpolate(index / numOfCircles));
  }

  /**
   * Sets the width and height of the element with the given id to the same value (becomes a square)
   * @param cssSelector the selector for selecting the element (e.g. '#elem')
   * @param size the length of one side of the square
   */
  export function scaleToSquare(cssSelector: string, size: number): void {
    d3.select(cssSelector)
      .style('width', `${size}px`)
      .style('height', `${size}px`);
  }

  /**
   * Returns the minimum side length of the element (minimum of the width or height of the element with the given selector)
   * @param cssSelector the selector for selecting the element (e.g. '#elem')
   */
  export function getMinimumSideLength(cssSelector: string): number {
    const container = d3.select(cssSelector);
    const width = Number(container.style('width').slice(0, -2));
    const height = Number(container.style('height').slice(0, -2));

    return Math.min(width, height);
  }

  /**
   * Returns the new maximum for the radar domain
   * @param radius the radius of a new position
   * @param max the current maximum domain value of the radar
   * @param numOfCircles the number of equidistant circles displayed in the radar
   * @param domainMultiplier the multiplier used for adjusting the range
   */
  export function getNewDomainMax(radius: number, max: number, numOfCircles: number, domainMultiplier: number): number {
    if (numOfCircles <= 0) {
      throw new Error(`Number of circles cannot be ${numOfCircles}`);
    }

    // If the radius is too close to the center, we want to adjust the radar make the distances between the circles smaller
    let adjustRadarThreshold = (max / numOfCircles) * 0.5;
    while (radius < adjustRadarThreshold) {
      max /= domainMultiplier;
      adjustRadarThreshold = (max / numOfCircles) * 0.5;
    }

    // If the radius is outside the range, we need to increase the radar range and make the distances between the circles larger
    while (radius > max) {
      max *= domainMultiplier;
    }

    return max;
  }

  /**
   * Returns the position on the radar
   * @param direction the unit vector, showing in the direction where the point should be displayed
   * @param factor determines the distance of the direction. Is in the range between 0 and 1
   */
  export function getPositionOnRadar(direction: Point, factor: number): Point {
    if (factor < 0 || factor > 1) {
      throw new Error(`Invalid factor ${factor}`);
    }
    const angle = Math.atan2(direction.y, direction.x);
    const x = 50 * (1 + Math.cos(angle) * factor);
    const y = 50 * (1 - Math.sin(angle) * factor);
    return new Point(x, y);
  }

  export function createAxis(axisEnum: AxisEnum, scaleMax: number, ticks: number): d3.Axis<any> {
    const domain = [];
    // We need an empty tick for 0
    domain.push('');

    const fraction = scaleMax / ticks;
    for (let i = 1; i <= ticks; i++) {
      const value = fraction * i;
      domain.push(getTickText(value));
    }
    const scale = d3.scalePoint()
      .domain(domain);

    let axis;
    switch (axisEnum) {
      case AxisEnum.X_AXIS:
      case AxisEnum.DIAGONAL_AXIS:
        scale.range([50, 100]);
        axis = d3.axisBottom(scale);
        break;
      case AxisEnum.Y_AXIS:
        scale.range([50, 0]);
        axis = d3.axisLeft(scale);
        break;
      default:
        throw new Error(`Invalid axisEnum ${axisEnum}`);
    }
    axis.tickSize(0);
    return axis;
  }

  export function getTickText(value: number): string {
    let exponential = 0;
    while (value > 1000) {
      value /= 1000;
      exponential++;
    }
    const unit = exponential > 0 ? 'km' : 'm';
    const e = exponential > 1 ? `e${exponential}` : '';
    return `${PositionUtil.roundToDecimalPlaces(value, 2)}${e}${unit}`;
  }
}
