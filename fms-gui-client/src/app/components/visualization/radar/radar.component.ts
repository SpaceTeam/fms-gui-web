import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {ResizeObserver} from 'resize-observer';
import {AxisEnum} from '../../../shared/enums/axis.enum';
import {Point} from '../../../shared/model/point.model';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit, OnDestroy {

  @Input()
  private id: string;
  private resizeObserver: ResizeObserver;

  private readonly containerId: string;
  private readonly svgId: string;
  private readonly equidistantCirclesId: string;
  private readonly axisId: string;

  constructor() {
    this.containerId = `${this.id}-container`;
    this.svgId = `${this.id}-g`;
    this.equidistantCirclesId = `${this.id}-equidistant-circles`;
    this.axisId = `${this.id}-axis`;
  }

  ngOnInit() {
    this.createRadar();
    this.listenToResize();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(document.querySelector('body'));
    }
  }

  /**
   * Creates the radar and all its components (e.g. the equidistant circles and directions)
   */
  private createRadar(): void {
    this.createRadarContainer();

    // Append the SVG object to the body of the page
    this.createRadarSVG();

    // Add the default number of equidistant circles to the radar
    this.addEquidistantCircleGroup();
    this.updateNumberOfEquidistantCircles(environment.visualization.radar.equidistant.circles);

    this.addDirections();
    this.addAxisGroups();
    this.addCircleGroup();
  }

  /**
   * Checks if the browser gets resized and adjusts the container size according to the new available width and height
   */
  private listenToResize(): void {
    const resizeObserver = new ResizeObserver(() => {
      d3.select(`#${this.containerId}`)
        .style('width', 0)
        .style('height', 0);
      RadarUtil.scaleToSquare(`#${this.containerId}`, RadarUtil.getMinimumSideLength(`#${this.id}`));
    });
    resizeObserver.observe(document.querySelector('body'));
  }

  /**
   * Appends a div to the radar component, which we can resize according to the radar dimensions
   */
  private createRadarContainer(): void {
    d3.select(`#${this.id}`)
      .append('div')
      .attr('id', `${this.containerId}`);

    RadarUtil.scaleToSquare(`#${this.containerId}`, RadarUtil.getMinimumSideLength(`#${this.id}`));
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the radar
   */
  private createRadarSVG(): void {
    d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('viewBox', '0 0 100 100')
      .append('g')
      .attr('id', `${this.svgId}`)
      .classed('radar-group', true);
  }

  /**
   * Adds the equidistant circles
   */
  private addEquidistantCircleGroup(): void {
    d3.select(`#${this.svgId}`)
      .append('g')
      .attr('id', `${this.equidistantCirclesId}`)
      .classed('circle-group', true);
  }

  /**
   * Adds the north, west, south, east directions to the radar
   */
  private addDirections(): void {
    d3.select(`#${this.svgId}`)
      .append('g')
      .attr('id', `${this.id}-directions`)
      .classed('direction-group', true)
      .selectAll('text')
      .data(environment.visualization.radar.directions)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .text(d => d.direction);
  }

  /**
   * Adds the x- and y-, and diagonal axis groups
   * The components, which use the radar, can then add their own axis
   */
  private addAxisGroups(): void {
    d3.select(`#${this.svgId}`)
      .append('g')
      .attr('id', `${this.axisId}`);

    this.createAxisGroup(AxisEnum.X_AXIS, {x1: 0, x2: 100, y1: 0, y2: 0});
    this.createAxisGroup(AxisEnum.Y_AXIS, {x1: 0, x2: 0, y1: 0, y2: 100});
    this.createAxisGroup(AxisEnum.DIAGONAL_AXIS, {x1: 0, x2: 0, y1: 0, y2: 0});
  }

  private createAxisGroup(axisEnum: AxisEnum, linePositions: {x1: number, x2: number, y1: number, y2: number}): void {
    const axis = d3.select(`#${this.axisId}`)
      .append('g')
      .attr('id', `${this.id}-${axisEnum}`)
      .classed('axis', true)
      .classed(axisEnum, true);

    // Append the correct domain line
    axis.append('line')
      .attr('x1', linePositions.x1)
      .attr('x2', linePositions.x2)
      .attr('y1', linePositions.y1)
      .attr('y2', linePositions.y2);
  }

  /**
   * Adds the group for the position circles and their links
   */
  private addCircleGroup(): void {
    d3.select(`#${this.svgId}`)
      .append('g')
      .attr('id', `${this.id}-circles`);
  }

  /**
   * Removes all d3 axis ticks from the radar
   */
  clearAxis(): void {
    Object.values(AxisEnum).forEach(axisEnum =>
      d3.select(`#${this.id}-${axisEnum}`)
        .selectAll('.tick')
        .remove()
    );
  }

  /**
   * Calls the given axis on the axis group with the given id
   *
   * @param axisEnum the selector of the axis group
   * @param scaleMax a number describing the maximum value of the axis scale
   * @param ticks the number of ticks to be displayed on the axis
   */
  setAxis(axisEnum: AxisEnum, scaleMax: number, ticks: number): void {
    d3.select(`#${this.id}-${axisEnum}`)
      .call(RadarUtil.createAxis(axisEnum, scaleMax, ticks))
      .select('.domain').remove();
  }

  /**
   * Toggles the display of the given axis
   * @param axisEnum the selector of the axis group
   */
  toggleAxisDisplay(axisEnum: AxisEnum): void {
    const axis = d3.select(`#${this.id}-${axisEnum}`);
    axis.classed('d-none', !axis.classed('d-none'));
  }

  /**
   * Draws the given positions and their links on the radar
   * @param positions an array of positions
   */
  drawPositions(positions: Array<Point>): void {
    this.drawDots(positions);
    this.drawLinks(positions);
  }

  /**
   * Draws the position dots on the radar
   * @param points an array of points
   */
  private drawDots(points: Array<Point>): void {
    const selector = `#${this.id}-circles`;

    // Append circles, if needed
    d3.select(selector)
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle');

    // Update the dots
    d3.select(selector)
      .selectAll('circle')
      .data(points)
      .attr('r', 1)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', 'black');
  }

  /**
   * Draws the connecting lines between the dots on the radar
   * @param points an array of points
   */
  private drawLinks(points: Array<Point>): void {
    // TODO: Implement me
  }

  /**
   * Adjusts the number of displayed equidistant circles
   * This method does not update any axis
   * @param numOfCircles the number of equidistant circles to be displayed
   */
  updateNumberOfEquidistantCircles(numOfCircles: number): void {
    const arr = RadarUtil.calculateEquidistantCircleRadii(numOfCircles).reverse();
    const selector = `#${this.equidistantCirclesId}`;

    // Append circles, if needed
    d3.select(selector)
      .selectAll('circle')
      .data(arr)
      .enter()
      .append('circle');

    // Remove unnecessary circles
    d3.select(selector)
      .selectAll('circle')
      .data(arr)
      .exit()
      .remove();

    // Adjust values
    d3.select(selector)
      .selectAll('circle')
      .data(arr)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', d => d - 0.05) // We need to subtract half of the stroke-width so that it fits the svg perfectly
      .style('fill', (d, i) => RadarUtil.calculateCircleFill(i, numOfCircles))
      .classed('equidistant-circle', true);
  }
}
