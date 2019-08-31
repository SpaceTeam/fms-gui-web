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

    // TODO: Let the user switch between (0,0) as the center and the first (lon,lat) as the center

    // Add circles to SVG
    svg.selectAll('circle')
      .data([this.center, this.center, ...this.positions])
      .enter()
      .append('circle')
      .attr('cx', position => this.positionInDiagram(position,'longitude'))
      .attr('cy', position => this.positionInDiagram(position,'latitude'))
      .attr('r', '0.25em')
      .attr('class', 'position');
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
    const x_1 = position[type] < x_0 ? 0 : this.size;

    const t = this.interpolationValue(position, type);
    return (1 - t) * x_0 + t * x_1;
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
   * @param negative specifies, whether the border value should be negative
   */
  interpolationValue(position: Position, type: PositionType, negative?: boolean): number {
    // First check, whether the start or end point have '0' as a value
    const x_0 = this.center[type];
    const x_1 = this.distanceToBorder(type) * (negative ? -1 : 1);

    const x = position[type];

    // Check whether the number is in the range between the numbers.
    // We assume, that x_0 is greater than x_1
    if (negative && !(x_1 <= x && x <= x_0)) {
      throw new RangeError(`Error: ${x} is out of bound between [${x_1},${x_0}]`);
    }
    // Check whether the number is in the range between the numbers.
    // We assume, that x_0 is less than x_1
    if (!negative && !(x_0 <= x && x <= x_1)) {
      throw new RangeError(`Error: ${x} is out of bound between [${x_0},${x_1}]`);
    }
    // Check whether there is any range
    if (x_0 === 0 && x_1 === 0) {
      return 0;
    }
    // Check if the lower border is 0 (a DivideByZeroException would then occur)
    if(x_0 === 0) {
      return x === 0 ? (negative ? 1 : 0) : x / x_1;
    }
    // Check, if the upper border is 0
    if(x_1 === 0) {
      return 1 - x / x_0;
    }
    // Calculate the simple interpolation value
    return (x / x_0 - 1) / (x_1 / x_0 - 1);

  }

  /**
   * Calculates the radius of a circle between the center and the most outer point
   * returns an integer with the radius to the border
   */
  radius2D(): number {
    return Math.hypot(this.distanceToBorder('longitude'), this.distanceToBorder('latitude'));
  }

  /**
   * Calculates the distance from the center of the diagram to the border
   * This is then needed in the 'positionInDiagram' method
   * We use the following formula for the calculation of distance d:
   *
   * d = ceil(|p_max[type]| - |p_0[type]|)
   *
   * @param type a property name of 'Position', e.g. 'longitude' or 'latitude'
   * @return the maximum property distance from the center to the border of the SVG
   */
  distanceToBorder(type: PositionType): number {
    const arr = [this.center, ...this.positions];

    // 1) Find the maximum of the absolute 'type' values in the set
    const typeArray = Array.from(arr, position => Math.abs(position[type]));

    // 2) Return the ceiled value
    return Math.ceil(Math.max(...typeArray) - Math.abs(this.center[type]));
  }
}
