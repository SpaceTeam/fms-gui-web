import {Component, Input, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter} from '@angular/core';

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

  @Output()
  private rotationEmitter: EventEmitter<number>;

  private resizeObserver: ResizeObserver;
  private zoom: d3.ZoomBehavior<any, any>;

  private svgId: string;
  private containerId: string;
  private svgGroupId: string;
  private equidistantCirclesId: string;
  private directionId: string;
  private axisId: string;
  private circleId: string;
  private readonly center: Point;

  constructor() {
    this.center = new Point(50, 50);
    this.rotationEmitter = new EventEmitter<number>();
  }

  ngOnInit() {
    this.svgId = `${this.id}-svg`;
    this.containerId = `${this.id}-container`;
    this.svgGroupId = `${this.id}-g`;
    this.equidistantCirclesId = `${this.id}-equidistant-circles`;
    this.directionId = `${this.id}-directions`;
    this.axisId = `${this.id}-axis`;
    this.circleId = `${this.id}-circles`;

    this.createRadar();
    this.listenToResize();
    this.listenToDragRotate();
    this.listenToZoom();
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
      .attr('id', this.svgId)
      .attr('viewBox', '0 0 100 100')
      .append('g')
      .attr('id', `${this.svgGroupId}`)
      .classed('radar-group', true);
  }

  /**
   * Adds the equidistant circles
   */
  private addEquidistantCircleGroup(): void {
    d3.select(`#${this.svgGroupId}`)
      .append('g')
      .attr('id', `${this.equidistantCirclesId}`)
      .classed('circle-group', true);
  }

  /**
   * Adds the north, west, south, east directions to the radar
   */
  private addDirections(): void {
    d3.select(`#${this.svgGroupId}`)
      .append('g')
      .attr('id', this.directionId)
      .classed('direction-group', true)
      .classed('transform-origin-center', true)
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
    d3.select(`#${this.svgGroupId}`)
      .append('g')
      .attr('id', `${this.axisId}`);

    const leftTopPoint = new Point(0, 0);
    const rightTopPoint = new Point(100, 0);
    const bottomLeftPoint = new Point(0, 100);

    this.createAxisGroup(AxisEnum.X_AXIS, leftTopPoint, rightTopPoint);
    this.createAxisGroup(AxisEnum.Y_AXIS, leftTopPoint, bottomLeftPoint);
    this.createAxisGroup(AxisEnum.DIAGONAL_AXIS, leftTopPoint, leftTopPoint);
  }

  private createAxisGroup(axisEnum: AxisEnum, startPoint: Point, endPoint: Point): void {
    const axis = d3.select(`#${this.axisId}`)
      .append('g')
      .attr('id', `${this.id}-${axisEnum}`)
      .classed('axis', true)
      .classed(axisEnum, true);

    // Append the correct domain line
    axis.append('line')
      .attr('x1', startPoint.x)
      .attr('y1', startPoint.y)
      .attr('x2', endPoint.x)
      .attr('y2', endPoint.y);
  }

  /**
   * Adds the group for the position circles and their links
   */
  private addCircleGroup(): void {
    d3.select(`#${this.svgGroupId}`)
      .append('g')
      .attr('id', this.circleId)
      .classed('transform-origin-center', true);
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
   * Draws the given positions and their links on the radar
   * @param points an array of coordinates on the radar
   */
  drawPositions(points: Array<Point>): void {
    this.drawDots(points);
    this.drawLinks(points);
  }

  /**
   * Draws the position dots on the radar
   * @param points an array of points
   */
  private drawDots(points: Array<Point>): void {
    const selector = `#${this.circleId}`;

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
    const selector = `#${this.circleId}`;

    // Append lines, if needed
    d3.select(selector)
      .selectAll('line')
      .data(points)
      .enter()
      .append('line')
      .classed('line', true);

    // Update the lines
    d3.select(selector)
      .selectAll('line')
      .data(points)
      .attr('x1', (d, i) => i === 0 ? this.center.x : points[i - 1].x)
      .attr('y1', (d, i) => i === 0 ? this.center.y : points[i - 1].y)
      .attr('x2', d => d.x)
      .attr('y2', d => d.y);
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

  /**
   * Checks if the user rotates the radar via the drag option
   * The user is able to rotate the radar by clicking and dragging inside the radar in the desired direction
   * CTRL + Drag
   */
  private listenToDragRotate(): void {
    const dragRotate = d3.drag()
      .filter(() => d3.event.ctrlKey)
      .on('drag', () => this.rotationEmitter.emit(Math.atan2(this.center.y - d3.event.y, d3.event.x - this.center.x)));

    d3.select(`#${this.svgGroupId}`).call(dragRotate);
  }

  /**
   * Adds a zoom listener and performs the transform on all components of the radar
   */
  private listenToZoom(): void {
    const translateMultiplier = 2;

    this.zoom = d3.zoom()
      .extent([[0, 0], [100, 100]])
      .scaleExtent([1, 100])
      .on('zoom', () => {
        const transform = d3.event.transform;
        const scale = transform.k;
        const translateX = transform.x * translateMultiplier * scale;
        const translateY = transform.y * translateMultiplier * scale;
        d3.select(`#${this.svgId}`).attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
      });

    d3.select(`#${this.svgId}`).call(this.zoom);
  }

  /**
   * Resets the zoom changes and centers the SVG
   */
  resetZoom(): void {
    const svg = d3.select(`#${this.svgId}`);
    const node = <Element>svg.node();
    svg.transition().duration(750).call(
      this.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(node).invert([this.center.x, this.center.y])
    );
  }

  /**
   * Rotates the components in the radar
   * @param angle the angle in degrees
   */
  rotate(angle: number): void {
    const rotation = `rotateZ(${angle * -1}deg)`;
    // Rotate the circles and directions
    d3.select(`#${this.circleId}`).style('transform', rotation);
    d3.select(`#${this.directionId}`).style('transform', rotation);
  }
}
