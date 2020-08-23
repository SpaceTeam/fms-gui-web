import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import {Subscription} from 'rxjs';

import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {AxisEnum} from '../../../shared/enums/axis.enum';
import {Point} from '../../../shared/model/point.model';
import {RadarConfigService} from '../../../shared/services/visualization/radar-config/radar-config.service';
import {RadarIdUtil} from '../../../shared/utils/visualization/radar-id/radar-id.util';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  private id: string;

  divId: string;

  private svg: any;

  /**
   * Contains the zooming behaviour for the radar
   */
  private zoom: d3.ZoomBehavior<any, any>;

  /**
   * The center of the radar SVG
   */
  private readonly center: Point;

  /**
   * The current rotation angle of the radar in radians
   */
  private currentRotationAngle: number;

  /**
   * The array of subscriptions inside the radar
   * Whenever the radar gets destroyed, all subscriptions need to be unsubscribed
   */
  private subscriptions: Array<Subscription>;

  constructor(private radarConfigService: RadarConfigService) {
    this.center = new Point(50, 50);
    this.currentRotationAngle = 0;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.divId = this.id + '-div';
  }

  ngAfterViewInit() {
    this.resizeSVGToFitContainer();
    this.createRadar();
    this.listenToDragRotate();
    this.listenToZoom();
    this.subscribeToRadarConfigService();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Creates the radar and all its components (e.g. the equidistant circles and directions)
   */
  private createRadar(): void {
    // Append the SVG object to the body of the page
    this.createRadarSVG();
    this.setRadarDimensions();

    // Add the default number of equidistant circles to the radar
    this.addEquidistantCircleGroup();
    this.updateNumberOfEquidistantCircles(environment.visualization.radar.equidistant.circles);

    this.addDirections();
    this.addAxisGroups();
    this.addCircleGroup();
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the radar
   */
  private createRadarSVG(): void {
    this.svg = d3.select(`#${this.id}`)
      .select('svg');
  }

  private setRadarDimensions(): void {
    this.svg
      .attr('viewBox', '0 0 100 100')
      .append('g')
      .attr('id', RadarIdUtil.getSVGGroupId(this.id))
      .classed('radar-group', true);
  }

  /**
   * Adds the equidistant circles
   */
  private addEquidistantCircleGroup(): void {
    d3.select(`#${RadarIdUtil.getSVGGroupId(this.id)}`)
      .append('g')
      .attr('id', RadarIdUtil.getEquidistantCirclesId(this.id))
      .classed('circle-group', true);
  }

  /**
   * Adds the north, west, south, east directions to the radar
   */
  private addDirections(): void {
    d3.select(`#${RadarIdUtil.getSVGGroupId(this.id)}`)
      .append('g')
      .attr('id', RadarIdUtil.getDirectionId(this.id))
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
    d3.select(`#${RadarIdUtil.getSVGGroupId(this.id)}`)
      .append('g')
      .attr('id', RadarIdUtil.getAxisId(this.id));

    const leftTopPoint = new Point(0, 0);
    const rightTopPoint = new Point(100, 0);
    const bottomLeftPoint = new Point(0, 100);

    this.createAxisGroup(AxisEnum.X_AXIS, leftTopPoint, rightTopPoint);
    this.createAxisGroup(AxisEnum.Y_AXIS, leftTopPoint, bottomLeftPoint);
    this.createAxisGroup(AxisEnum.DIAGONAL_AXIS, leftTopPoint, leftTopPoint);
  }

  /**
   * Creates a group for the given axis
   *
   * @param axisEnum the type of axis (x-axis, y-axis or diagonal)
   * @param startPoint the start point of the axis line
   * @param endPoint the end point of the axis line
   */
  private createAxisGroup(axisEnum: AxisEnum, startPoint: Point, endPoint: Point): void {
    const axis = d3.select(`#${RadarIdUtil.getAxisId(this.id)}`)
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
    d3.select(`#${RadarIdUtil.getSVGGroupId(this.id)}`)
      .append('g')
      .attr('id', RadarIdUtil.getCircleId(this.id))
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
    const selector = `#${RadarIdUtil.getCircleId(this.id)}`;

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
    const selector = `#${RadarIdUtil.getCircleId(this.id)}`;

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
    const selector = `#${RadarIdUtil.getEquidistantCirclesId(this.id)}`;

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
    let lastPosition: Point;
    // TODO: Fix the drag rotation
    // -> getting the angle difference works, but we somehow mix up setting the new angle
    // Probably because how we set the currentRotationAngle in 'rotate'
    const dragRotate = d3.drag()
      .filter(() => d3.event.ctrlKey)
      .on('start', () => lastPosition = new Point(d3.event.x, d3.event.y));

    d3.select(`#${RadarIdUtil.getSVGGroupId(this.id)}`).call(dragRotate);
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
        d3.select(`#${RadarIdUtil.getSVGId(this.id)}`).attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
      });

    // TODO: Zoom does not work properly -> it should zoom to the point where the cursor is and not just a random zoom
    // TODO: The same with the translate property -> you shouldn't need the multiplier
    d3.select(`#${RadarIdUtil.getSVGId(this.id)}`).call(this.zoom);
  }

  /**
   * Resets the zoom changes and centers the SVG
   */
  resetZoom(): void {
    const svg = d3.select(`#${RadarIdUtil.getSVGId(this.id)}`);
    const node = <Element>svg.node();
    svg.transition().duration(750).call(
      this.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(node).invert([this.center.x, this.center.y])
    );
  }

  /**
   * Rotates the components in the radar
   * TODO: When rotating, the text should stay not be rotated!
   * @param angle the angle in radians
   */
  rotate(angle: number): void {
    this.currentRotationAngle = angle;
    const rotation = `rotate(${angle * -1}rad)`;
    // Rotate the circles and directions
    d3.select(`#${RadarIdUtil.getCircleId(this.id)}`).style('transform', rotation);
    d3.select(`#${RadarIdUtil.getDirectionId(this.id)}`).style('transform', rotation);
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeSVGToFitContainer();
  }

  resizeSVGToFitContainer() {
    const radarElem = document.getElementById(this.id);
    const divElem = document.getElementById(this.divId);
    divElem.style.display = 'none';
    const radarWidth = radarElem.clientWidth;
    const radarHeight = radarElem.clientHeight;
    const radarSize = Math.min(radarWidth, radarHeight);
    divElem.style.width = radarSize + 'px';
    divElem.style.height = radarHeight + 'px';
    divElem.style.display = '';
  }

  /**
   * Whenever something in the radar config changes, the radar should change
   * Subscribes to all changes in the radar config
   */
  private subscribeToRadarConfigService(): void {
    const subscription = this.radarConfigService.resetZoomClicked$.subscribe(() => this.resetZoom());
    this.subscriptions.push(subscription);
  }

  get height(): number {
    return parseInt(d3.select(this.id).style('height'), 10);
  }

  get width(): number {
    return parseInt(d3.select(this.id).style('width'), 10);
  }
}
