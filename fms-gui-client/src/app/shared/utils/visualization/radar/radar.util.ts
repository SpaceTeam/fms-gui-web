import * as d3 from 'd3';

export namespace RadarUtil {

  /**
   * Calculates the radii for the correct drawing of the equidistant circles
   * @param numOfCircles a positive integer, indicating how many equidistant circles should be displayed
   */
  export function calculateEquidistantCircleRadii(numOfCircles: number): Array<number> {
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
   * @param id the element's id
   * @param size the length of one side of the square
   */
  export function scaleToSquare(id: string, size: number): void {
    // TODO: Test me
    d3.select(id)
      .style('width', `${size}px`)
      .style('height', `${size}px`);
  }

  /**
   * Returns the minimum of the width or height of the element with the given id
   * @param id the element's id
   */
  export function getRadarSize(id: string): number {
    const container = d3.select(id);
    const width = Number(container.style('width').slice(0, -2));
    const height = Number(container.style('height').slice(0, -2));

    return width < height ? width : height;
  }
}
