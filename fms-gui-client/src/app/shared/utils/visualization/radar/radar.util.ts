import * as d3 from 'd3';
import {NegativeNumberException} from '../../../exceptions/negative-number.exception';
import {Point} from '../../../model/point.model';
import {PositionUtil} from '../../position/position.util';

export namespace RadarUtil {

  const translateRegex = /translate\(-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/gm;
  const rotateRegex = /rotate\(-?\d+(\.\d+)?\)/gm;
  const scaleRegex = /scale\(-?\d+(\.\d+)?\)/gm;
  const numberRegex = /-?\d+(\.\d+)?/gm;

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

    const circleRadiiInterpolate = d3.interpolateNumber(0, 50);

    return Array.from(Array(numOfCircles).keys())
      .map(val => circleRadiiInterpolate((val + 1) / numOfCircles));
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

    // If the radius is too close to the center, we want to adjust the radar and make the distances between the circles smaller
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

  export function getDistanceRange(maxValue: number, numOfEquidistantCircles: number): Array<string> {
    // TODO: Implement me
    return [];
  }

  /**
   * Returns the adjusted distance text for a numeric value the distance axis
   * @param value the distance which needs to be converted to a distance text
   */
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

  /**
   * Returns the angle between two points
   * @param prevPosition the first mouse position (on drag start)
   * @param currentPosition the current mouse position
   * @param center the radar's center
   * @return the angle difference between the two positions
   */
  export function getAngleDifference(prevPosition: Point, currentPosition: Point, center: Point): number {
    // 1) Transform both positions to the center and flip y -> transform to cartesian
    prevPosition = toCartesian(prevPosition, center);
    currentPosition = toCartesian(currentPosition, center);

    // 2) Compute the angles for the two positions and the resulting difference
    const prevAngle = Math.atan2(prevPosition.y, prevPosition.x);
    const currAngle = Math.atan2(currentPosition.y, currentPosition.x);

    return currAngle - prevAngle;
  }

  export function toDegrees(rad: number): number {
    return rad * (180 / Math.PI);
  }

  export function toRadians(deg: number): number {
    return deg * (Math.PI / 180);
  }

  export function toCartesian(point: Point, center: Point): Point {
    return new Point(point.x - center.x, center.y - point.y);
  }

  /**
   * Converts a string representation of a transformation into an object
   * @param transformString the string containing the transformation
   */
  export function getTransformObject(transformString: string): { x: number, y: number, k: number, r: number } {
    let x = 0;
    let y = 0;
    let k = 1;
    let r = 0;
    let numbers;

    if (transformString !== null) {
      const translate = transformString.match(translateRegex);
      const scale = transformString.match(scaleRegex);
      const rotate = transformString.match(rotateRegex);

      if (translate) {
        numbers = translate[0].match(numberRegex);
        x = Number(numbers[0]);
        y = Number(numbers[1]);
      }
      if (scale) {
        numbers = scale[0].match(numberRegex);
        k = Number(numbers[0]);
      }
      if (rotate) {
        numbers = rotate[0].match(numberRegex);
        r = Number(numbers[0]);
      }
    }
    return {x, y, k, r};
  }

  export function buildTransformString(x: number, y: number, k: number, r: number): string {
    return `scale(${k}) translate(${x},${y}) rotate(${r})`;
  }
}
