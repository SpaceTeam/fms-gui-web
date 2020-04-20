import * as d3 from 'd3';
import {NegativeNumberException} from '../../../exceptions/negative-number.exception';

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
}
