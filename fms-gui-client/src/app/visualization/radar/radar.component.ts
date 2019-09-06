import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../shared/model/flight/position';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {PositionType} from '../../shared/model/flight/position.type';
import {PositionUtil} from '../../shared/utils/position/position.util';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit {

  /**
   * The SVG element's id
   */
  chartId = 'radar-chart-svg';

  /**
   * The SVG container's id
   */
  chartContainerId = 'radar-chart-div';

  /**
   * The size of the container
   */
  size: number;

  /**
   * The current and previous positions of the flight object
   */
  positions: Array<Position>;

  /**
   * Custom position
   */
  center: Position;

  radius: number;

  // TODO: The height factor will also change!
  maxAltitude: number;


  constructor(private positionService: PositionService) {
    // Initialize the local objects
    this.positions = [];
  }

  ngOnInit() {
    this.initChart();

    // Save the current position
    this.positionService.positionAnnounced$.subscribe((position: Position) => {
      // Only add the position, if really necessary
      if (this.positions.filter(pos =>
        (new Position(pos.longitude, pos.latitude, pos.altitude, pos.timestamp)).equals(position)).length === 0) {
        this.positions.push(position);
        if (position.altitude > this.maxAltitude) {
          this.maxAltitude = position.altitude;
        }
      }
      this.addPositionsToChart();
    });
  }

  private initChart(): void {
    const elem = d3.select('#' + this.chartContainerId);
    const svg = elem.append('svg');

    this.size = Math.min(Number(elem.style('width').slice(0, -2)), Number(elem.style('height').slice(0, -2)));
    this.radius = this.size / 2;
    // TODO: Redraw the whole SVG (or at least the positions), whenever this value changes
    this.maxAltitude = 1000;

    svg.attr('width', this.size);
    svg.attr('height', this.size);
    svg.attr('id', this.chartId);

    // Set the center of the SVG
    // TODO: Let the user decide what the center should be
    this.center = new Position(50, 15);

    // TODO: Let the user decide how many equidistant circles should be drawn
    const factor = 5;
    const distance = this.radius / factor;
    const radii = [];
    for (let i = 1; i <= factor; i++) {
      radii.push(distance * i);
    }

    // TODO: You should be able to scale the SVG
    svg
      .append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', '0.1em')
      .classed('center', true);

    svg
      .selectAll('circle.circles')
      .data(radii)
      .enter()
      .append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', r => r)
      .classed('circles', true);
  }

  private addPositionsToChart(): void {
    const svg = d3.select('#' + this.chartId);

    // Add lines to SVG
    // TODO: They should go from one position to the other (except the first one)

    // Add circles to SVG
    svg.selectAll('circle.position')
      .data([...this.positions])
      .enter()
      .append('circle')
      .attr('cx', position => this.x(position))
      .attr('cy', position => this.y(position))
      .attr('r', '0.25em')
      .attr('fill', position => d3.interpolatePlasma((1 / this.maxAltitude) * position.altitude))
      .attr('class', 'position')
  }

  // TODO: Move all of the following methods into a static Visualization helper
  x(position: Position): number {
    return this.radius + PositionUtil.getNormalizedDirection(position, this.center).longitude *
      (position.altitude / this.maxAltitude * this.radius);
  }

  y(position: Position): number {
    return this.radius - PositionUtil.getNormalizedDirection(position, this.center).latitude *
      (position.altitude / this.maxAltitude * this.radius);
  }

  /**
   * Calculates the distance of the given position from the center, based on the given type
   * It scales with the outer most point (the length between the center and edge varies with the outer most point)
   *
   * Also called the 'lerp' method (see https://en.wikipedia.org/wiki/Linear_interpolation)
   *
   * @param position of the point of interest
   * @param type used for calculating the distance from the center
   */
  interpolatedPositionInSquare(position: Position, type: PositionType): number {
    const x_0 = this.size / 2;
    const x_1 = this.size;

    const t = this.interpolationValue(position, type);
    return PositionUtil.roundNumber((1 - t) * x_0 + t * x_1);
  }

  /**
   * This method returns the 't' value, for a linear interpolation
   *
   * The general method we would like to use is a simple linear interpolation between values of one dimension:
   * x = (1 - t) * x_0 + t * x1
   *
   * To get the 't', we just have to reform the upper equation to
   * t = (x / x_0 - 1) / (x_1 / x_0 - 1)
   *
   * It is possible, that either x_0, x_1 or both are zero, so we have to take care of this
   *
   * @param position contains the 'x' we need to use for the calculation
   * @param type the specific value we want to use for the interpolation
   */
  interpolationValue(position: Position, type: PositionType): number {
    const distance = this.longestDistance(type);
    const x_0 = PositionUtil.roundNumber(this.center[type]);
    const x_1 = PositionUtil.roundNumber(x_0 + distance); // upper bound
    const l = PositionUtil.roundNumber(x_0 - distance);  // lower bound
    const x = PositionUtil.roundNumber(position[type]);
    let value;

    // Check whether the number is in the range between the numbers
    if (!(l <= x && x <= x_1)) {
      throw new RangeError(`Error: ${x} is out of bounds between [${l},${x_1}]`);
    }
    // Check whether there is any range
    if (x_0 === x_1) {
      value = 0;
    }
    // Check if the lower border is 0 (a DivideByZeroException would then occur)
    else if (x_0 === 0) {
      value = x / x_1;
    }
    // Check, if the upper border is 0
    else if (x_1 === 0) {
      value = 1 - x / x_0;
    }
    // Calculate the simple interpolation value
    else {
      value = (x - x_0) / (x_1 - x_0);
    }
    return PositionUtil.roundNumber(value);
  }

  /**
   * Calculates the distance from the center of the diagram to the border (outer most element)
   * This is then needed in the 'interpolatedPositionInSquare' method
   * We use the following formula for the calculation of distance d:
   *
   * d = |p_max[type]| - |p_0[type]|
   *
   * @param type a property name of 'Position', e.g. 'longitude' or 'latitude'
   * @return the maximum property distance from the center to the border of the SVG
   */
  longestDistance(type: PositionType): number {
    const arr = [this.center, ...this.positions];

    // 1) Get only the needed values from the positions array, map them to be the difference between the center and the new point
    const typeArray = Array
      .from(arr, position => position[type])
      .map(value => Math.abs(value - this.center[type]));

    // 2) Return the maximum distance
    const max = Math.max(...typeArray);
    return PositionUtil.roundNumber(max);
  }
}
