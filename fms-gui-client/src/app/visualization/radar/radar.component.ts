import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../shared/model/flight/position';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {PositionUtil} from '../../shared/utils/position/position.util';
import {environment} from '../../../environments/environment';
import {RadarForm} from '../../shared/forms/radar.form';

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
   * The SVG parent's id
   */
  chartContainerId = 'radar-chart-div';

  /**
   * The radar group id
   */
  radarGroupId = 'radar-group';

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

  /**
   * The radius of the radar
   */
  radius: number;

  /**
   * Stores the current maximum altitude of the rocket
   * This value is needed for the calculation of distances between the center and the outer most border
   */
  maxAltitude: number;

  constructor(private positionService: PositionService, private radarForm: RadarForm) {
    // Initialize the local objects
    this.positions = [];
    this.maxAltitude = environment.visualization.radar.position.max.altitude;
  }

  ngOnInit() {
    this.initChart();

    // Save the current position
    this.subscribeToPositions();

    // Update the center, whenever the center was changed
    this.subscribeToCenterChange();

    // Update the svg, whenever the rotation was changed
    this.subscribeToRotationChange();
  }

  /**
   * Initializes the chart, like giving it a size and basic configuration (equidistant circles, set the center)
   */
  private initChart(): void {
    const elem = d3.select('#' + this.chartContainerId);
    const svg = elem.insert('svg', ':first-child');

    svg.attr('width', '100%');

    this.size = Math.min(Number(svg.style('width').slice(0, -2)), Number(svg.style('height').slice(0, -2)));
    this.radius = this.size / 2;

    // We need to set the width and height, so that the rotation works properly
    // Somehow transform-origin uses the outer most width and height for setting the transform origin
    svg
      .attr('id', this.chartId)
      .attr('width', this.size)
      .attr('height', this.size)
      .attr('viewport', `[0 0 ${this.size} ${this.size}]`);

    // SVG elements

    // TODO: Let the user decide how many equidistant circles should be drawn
    const distance = this.radius / environment.visualization.radar.equidistant.circles;
    const radii = [];
    for (let i = 1; i <= environment.visualization.radar.equidistant.circles; i++) {
      radii.push(distance * i);
    }
    const interpolation = d3.interpolateNumber(0.1, 0.7);

    const g = svg.append('g')
      .attr('id', this.radarGroupId);

    // TODO: You should be able to scale the SVG
    g.selectAll('circle.circles')
      .data(radii.reverse())
      .enter()
      .append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', r => r)
      .style('fill', (d, i) => d3.interpolateGreys(interpolation(i / environment.visualization.radar.equidistant.circles)))
      .classed('circles', true);

    g.append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', (environment.visualization.radar.circle.radius / 2))
      .classed('center', true);

    // Rotation
    const i = d3.interpolateNumber(-1, 1);
    d3.select('#' + this.radarGroupId)
      .call(d3.drag().on('drag', () => this.radarForm.dragRotation(i(d3.event.x / this.size), i(d3.event.y / this.size))));
  }

  /**
   * Lets the radar listen to incoming positions
   */
  private subscribeToPositions(): void {
    this.positionService.positionAnnounced$.subscribe((position: Position) => {
      // Only add the position, if really necessary
      if (this.positions.filter(pos => PositionUtil.newPosition(pos).equals(position)).length === 0) {
        this.positions.push(position);
        if (position.altitude > this.maxAltitude) {
          this.maxAltitude = position.altitude;
          this.clearChart();
        }
      }
      this.addPositionsToChart();
    });
  }

  /**
   * Lets the radar listen to incoming center changes
   */
  private subscribeToCenterChange(): void {
    this.radarForm.centerChanged$.subscribe((center: Position) => {
      this.center = center;
      this.clearChart();
      this.addPositionsToChart();
    });
    this.radarForm.initCenter();
  }

  /**
   * Lets the radar listen to incoming rotation changes
   */
  private subscribeToRotationChange(): void {
    this.radarForm.rotationChanged$.subscribe((degree: number) =>
        d3.select('#' + this.radarGroupId).style('transform', `rotateZ(${degree}deg)`)
    );
  }

  /**
   * Removes all circles and paths from the radar chart
   */
  private clearChart(): void {
    const g = d3.select('#' + this.radarGroupId);

    g.selectAll('path.connection').remove();
    g.selectAll('circle.position').remove();
  }

  /**
   * Adds everything related to the radar chart to the SVG
   */
  private addPositionsToChart(): void {
    const g = d3.select('#' + this.radarGroupId);

    // Add lines to SVG
    g.selectAll('path.connection')
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
    g.selectAll('circle.position')
      .data([...this.positions])
      .enter()
      .append('circle')
      .attr('cx', position => this.x(position))
      .attr('cy', position => this.y(position))
      .attr('r', environment.visualization.radar.circle.radius)
      .attr('fill', position => d3.interpolatePlasma((1 / this.maxAltitude) * position.altitude))
      .attr('class', 'position')
      .on('mouseenter', this.handleMouseEnterPositionCircle)
      .on('mouseleave', this.handleMouseLeavePositionCircle);

    // Re-insert (raise) the circle elements, so that they are always on top
    g.selectAll('circle.position').raise();
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
   * A method for handling the mouse enter a circle
   * @param d the position of the circle
   * @param i the index of the circle inside the positions array
   * @param circles the array of circle, in which we can find the current circle
   */
  private handleMouseEnterPositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
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
  private handleMouseLeavePositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    const circle = circles[i];
    d3.select(circle)
      .attr('r', circle.r.baseVal.value / 1.5);
  }
}
