import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../shared/model/flight/position';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {PositionUtil} from '../../shared/utils/position/position.util';
import {environment} from '../../../environments/environment';

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
   * TODO: Set this per default in environment.ts
   */
  center: Position;

  radius: number;

  // TODO: The height equidistantCirclesNumber will also change!
  // TODO: Set this per default in environment.ts
  maxAltitude: number;

  constructor(private positionService: PositionService) {
    // Initialize the local objects
    this.positions = [];
    this.maxAltitude = environment.visualization.position.max.altitude;
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

    // TODO: Redraw the whole SVG (or at least the positions), whenever the maximum altitude changes

    svg.attr('width', this.size);
    svg.attr('height', this.size);
    svg.attr('id', this.chartId);

    // Set the center of the SVG
    // TODO: Let the user decide what the center should be
    this.center = new Position(50, 15);

    // TODO: Let the user decide how many equidistant circles should be drawn
    const distance = this.radius / environment.visualization.radar.equidistant.circles;
    const radii = [];
    for (let i = 1; i <= environment.visualization.radar.equidistant.circles; i++) {
      radii.push(distance * i);
    }
    const interpolation = d3.interpolateNumber(0.1, 0.7);

    // TODO: You should be able to scale the SVG
    svg
      .selectAll('circle.circles')
      .data(radii.reverse())
      .enter()
      .append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', r => r)
      .style('fill', (d, i) => d3.interpolateGreys(interpolation(i / environment.visualization.radar.equidistant.circles)))
      .classed('circles', true);

    svg
      .append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', (environment.visualization.radar.circle.radius / 2))
      .classed('center', true);
  }

  private addPositionsToChart(): void {
    const svg = d3.select('#' + this.chartId);

    // Add lines to SVG
    // TODO: Lines should go from one position to the other (except the first one)

    // Add circles to SVG
    svg.selectAll('circle.position')
      .data([...this.positions])
      .enter()
      .append('circle')
      .attr('cx', position => this.x(position))
      .attr('cy', position => this.y(position))
      .attr('r', environment.visualization.radar.circle.radius)
      .attr('fill', position => d3.interpolatePlasma((1 / this.maxAltitude) * position.altitude))
      .attr('class', 'position')
  }

  /**
   * Calculates the x-position for a given point in the diagram
   * @param position contains the values for calculating the x-position
   */
  x(position: Position): number {
    return this.radius + PositionUtil.getNormalizedDirection(position, this.center).longitude *
      (position.altitude / this.maxAltitude * this.radius);
  }

  /**
   * Calculates the y-position for a given point in the diagram
   * @param position contains the values for calculating the y-position
   */
  y(position: Position): number {
    return this.radius - PositionUtil.getNormalizedDirection(position, this.center).latitude *
      (position.altitude / this.maxAltitude * this.radius);
  }
}
