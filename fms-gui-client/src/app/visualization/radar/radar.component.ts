import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../shared/model/flight/position';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {PositionType} from '../../shared/model/flight/position.type';

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

  constructor(private positionService: PositionService) {
    // Initialize the local objects
    this.positions = [];
  }

  ngOnInit() {
    this.initChart();

    // Save the current position
    this.positionService.positionAnnounced$.subscribe(position => {
      // Only add the position, if really necessary
      if (!this.positions.includes(position)) {
        this.positions.push(position);
      }
      this.addPositionsToChart();
    });
  }

  private initChart(): void {
    const elem = d3.select('#' + this.chartContainerId);
    const svg = elem.append('svg');

    this.size = Math.min(Number(elem.style('width').slice(0, -2)), Number(elem.style('height').slice(0, -2)));
    const halfSize = this.size / 2;

    svg.attr('width', this.size);
    svg.attr('height', this.size);
    svg.attr('id', this.chartId);

    // Set the center of the SVG
    // TODO: Let the user decide what the center should be
    this.center = new Position(50, 15);

    // TODO: You should be able to scale the SVG
    svg
      .data([this.center])
      .append('circle')
      .attr('cx', () => halfSize)
      .attr('cy', () => halfSize)
      .attr('r', '0.1em');

    svg
      .data([this.center])
      .append('circle')
      .attr('cx', () => halfSize)
      .attr('cy', () => halfSize)
      .attr('r', halfSize)
      .classed('circles', true);
  }

  private addPositionsToChart(): void {
    const svg = d3.select('#' + this.chartId);

    // Add lines to SVG
    // TODO: They should go from one position to the other (except the first one)

    // Add circles to SVG
    svg.selectAll('circle')
      .data([this.center, this.center, ...this.positions])
      .enter()
      .append('circle')
      .attr('cx', position => this.x(position))
      .attr('cy', position => this.y(position))
      .attr('r', '0.25em')
      .attr('class', 'position');
  }

  // TODO: Move all of the following methods into a static Visualization helper
  x(position: Position): number {
    return this.positionInDiagram(position, 'longitude');
  }

  y(position: Position): number {
    return this.size - this.positionInDiagram(position, 'latitude');
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
  positionInDiagram(position: Position, type: PositionType): number {
    const x_0 = this.size / 2;
    const x_1 = this.size;

    const t = this.interpolationValue(position, type);
    return this.roundNumber((1 - t) * x_0 + t * x_1);
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
    const x_0 = this.roundNumber(this.center[type]);
    const x_1 = x_0 + distance; // upper bound
    const l = x_0 - distance;  // lower bound
    const x = this.roundNumber(position[type]);
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
    return this.roundNumber(value);
  }

  /**
   * Calculates the distance from the center of the diagram to the border (outer most element)
   * This is then needed in the 'positionInDiagram' method
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
    return this.roundNumber(max);
  }

  roundNumber(num: number): number {
    return Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6);
  }
}
