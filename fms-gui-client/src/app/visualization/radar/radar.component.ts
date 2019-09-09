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

  /**
   * The radius of the radar
   */
  radius: number;

  // TODO: The maximum altitude will also change!
  maxAltitude: number;

  constructor(private positionService: PositionService) {
    // Initialize the local objects
    this.positions = [];
    this.maxAltitude = environment.visualization.radar.position.max.altitude;
    this.center = new Position(
      environment.visualization.radar.position.center.longitude,
      environment.visualization.radar.position.center.latitude
    );
  }

  ngOnInit() {
    this.initChart();

    // Save the current position
    this.positionService.positionAnnounced$.subscribe((position: Position) => {
      // Only add the position, if really necessary
      if (this.positions.filter(pos => PositionUtil.newPosition(pos).equals(position)).length === 0) {
        this.positions.push(position);
        if (position.altitude > this.maxAltitude) {
          this.maxAltitude = position.altitude;
        }
      }
      this.addPositionsToChart();
    });
  }

  /**
   * Initializes the chart, like giving it a size and basic configuration (equidistant circles, set the center)
   */
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

    // TODO: Let the user decide how many equidistant circles should be drawn
    const distance = this.radius / environment.visualization.radar.equidistant.circles;
    const radii = [];
    for (let i = 1; i <= environment.visualization.radar.equidistant.circles; i++) {
      radii.push(distance * i);
    }
    const interpolation = d3.interpolateNumber(0.1, 0.7);

    // TODO: You should be able to scale the SVG
    // TODO: You should be able to rotate the SVG
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

  /**
   * Adds everything related to the radar chart to the SVG
   */
  private addPositionsToChart(): void {
    const svg = d3.select('#' + this.chartId);

    // Add lines to SVG
    svg.selectAll('path.connection')
      .data([this.center, ...this.positions])
      .enter()
      .datum([this.center, ...this.positions])
      .append('path')
      .attr('class', 'connection')
      .attr('d', d3.line<Position>()
        .x(pos => this.x(pos))
        .y(pos => this.y(pos))
      );

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
      .on('mouseover', this.handleMouseOverPositionCircle)
      .on('mouseout', this.handleMouseOutPositionCircle);

    // Re-insert (raise) the circle elements, so that they are always on top
    svg.selectAll('circle.position').raise();
  }

  /**
   * Calculates the x-position for a given point in the diagram
   * @param position contains the values for calculating the x-position
   */
  private x(position: Position): number {
    return this.radius + PositionUtil.getNormalizedDirection(position, this.center).longitude * this.altitudeStep(position.altitude);
  }

  /**
   * Calculates the y-position for a given point in the diagram
   * @param position contains the values for calculating the y-position
   */
  private y(position: Position): number {
    return this.radius - PositionUtil.getNormalizedDirection(position, this.center).latitude * this.altitudeStep(position.altitude);
  }

  /**
   * Calculates the step a point should take from the center
   * @param altitude the altitude of the current position
   */
  private altitudeStep(altitude: number): number {
    return (altitude / this.maxAltitude) * this.radius;
  }

  /**
   * A method for handling the mouse over a circle (like mouse enter)
   * @param d the position of the circle
   * @param i the index of the circle inside the positions array
   * @param circles the array of circle, in which we can find the current circle
   */
  private handleMouseOverPositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    // const position = new Position(d.longitude, d.latitude, d.altitude, d.timestamp);
    const circle = circles[i];
    d3.select(circle)
      .attr('r', circle.r.baseVal.value * 1.5);
  }

  /**
   * A method for handling the mouse exit of a circle
   * @param d the position of the circle
   * @param i the index of the circle inside the positions array
   * @param circles the array of circle, in which we can find the current circle
   */
  private handleMouseOutPositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    const circle = circles[i];
    d3.select(circle)
      .attr('r', circle.r.baseVal.value / 1.5);
  }
}
