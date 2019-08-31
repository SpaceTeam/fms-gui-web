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
      .attr('cx', position => this.center.longitude + this.calculateDistanceFromCenter(position,'longitude'))
      .attr('cy', position => this.center.latitude - this.calculateDistanceFromCenter(position,'latitude'))
      .attr('r', '0.25em')
      .attr('class', 'position');
  }

  /**
   * Calculates the distance of the given position from the center, based on the given type
   *
   * @param position of the point of interest
   * @param type used for calculating the distance from the center
   */
  calculateDistanceFromCenter(position: Position, type: PositionType): number {
    // Calculate the distance from the center of the visualization (vertical and horizontal)
    if (position.equals(this.center)) {
      return 0;
    }

    const step: number = (this.size / 2) / this.calculateDistanceToBorder(type);
    return position[type] * step;
  }

  /**
   * Calculates the distance from the center of the diagram to the border
   * This is then needed in the 'calculateDistanceFromCenter' method
   * We use the following formula for the calculation of distance d:
   *
   * d = floor(|p_max[type]| - |p_0[type]|) + 1
   *
   * @param type a property name of 'Position', e.g. 'longitude' or 'latitude'
   * @return the maximum property distance from the center to the border of the SVG
   */
  calculateDistanceToBorder(type: PositionType): number {
    const arr = [this.center, ...this.positions];

    // 1) Find the maximum of the absolute 'type' values in the set
    const typeArray = Array.from(arr, position => Math.abs(position[type]));

    // 2) Return the ceiled value
    return Math.floor(Math.max(...typeArray) - Math.abs(this.center[type])) + 1;
  }
}
