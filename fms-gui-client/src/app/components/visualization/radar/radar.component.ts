import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import {Subscription} from 'rxjs';

import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {AxisEnum} from '../../../shared/enums/axis.enum';
import {Point} from '../../../shared/model/point.model';
import {RadarConfigService} from '../../../shared/services/visualization/radar-config/radar-config.service';
import {RadarIdUtil} from '../../../shared/utils/visualization/radar-id/radar-id.util';

// TODO: Listen to the brush service and update the chart when a change has occurred
// TODO: When you rotate, the value inside the input should also change
// TODO: You should be able to zoom into the region where your mouse is, not a random zoom
// TODO: Add the distances to the radar
// TODO: Add tooltips to each dot
@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * The parameter/attribute used to pass the div's id around
   */
  @Input()
  private id: string;

  /**
   * The id of the div used to store the SVG
   * Since we can include a radar dynamically, we pass this id around to ensure that the right SVG is selected
   */
  divId: string;

  private svg: any;
  private svgGroup: any;

  /**
   * Contains the zooming behaviour for the radar
   */
  private zoom: d3.ZoomBehavior<any, any>;

  /**
   * The center of our radar
   */
  private readonly center: Point;

  /**
   * The array of subscriptions inside the radar
   * Whenever the radar gets destroyed, all subscriptions need to be unsubscribed
   */
  private subscriptions: Array<Subscription>;

  /**
   * Stores the points to be drawn on the radar
   */
  private readonly points: Array<Point>;

  constructor(private radarConfigService: RadarConfigService) {
    this.center = new Point(50, 50);
    this.subscriptions = [];
    this.points = [];
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
    this.setSVGProperties();
    this.createRadarGroup();

    // Add the default number of equidistant circles to the radar
    this.addEquidistantCircleGroup();
    this.updateNumberOfEquidistantCircles(environment.visualization.radar.equidistant.circles);

    this.addAxisGroups();
    this.addCircleGroup();
  }

  /**
   * Loads the SVG and sets its properties (currently only the viewBox)
   */
  private setSVGProperties(): void {
    this.svg = d3.select(`#${this.id}`)
      .select('svg')
      .attr('viewBox', '-5 -5 110 110');  // min-x min-y width height
  }

  /**
   * Creates the group inside the radar, which handles all sub groups and components
   */
  private createRadarGroup(): void {
    this.svgGroup = this.svg.append('g')
      .attr('id', this.id + '-g')
      .attr('transform-origin', `${this.center.x} ${this.center.y}`);
  }

  /**
   * Adds the equidistant circles
   */
  private addEquidistantCircleGroup(): void {
    this.svgGroup
      .append('g')
      .attr('id', RadarIdUtil.getEquidistantCirclesId(this.id));
  }

  /**
   * Adds the x- and y-, and diagonal axis groups
   * The components, which use the radar, can then add their own axis
   */
  private addAxisGroups(): void {
    this.svgGroup
      .append('g')
      .attr('id', RadarIdUtil.getAxisId(this.id));

    this.createDirectionAxis(AxisEnum.X_AXIS);
    this.createDirectionAxis(AxisEnum.Y_AXIS);
  }

  /**
   * Creates a direction axis (e.g. NS or WE)
   * @param axisEnum an axis enum
   */
  private createDirectionAxis(axisEnum: AxisEnum): void {
    let domain: Array<string>;
    let axisMethod;
    let dx: string;
    let x = 0;
    let y = 0;

    switch (axisEnum) {
      case AxisEnum.X_AXIS:
        domain = ['W', 'E'];
        axisMethod = d3.axisBottom;
        x = 0;
        y = 50;
        dx = '';
        break;
      case AxisEnum.Y_AXIS:
        domain = ['N', 'S'];
        axisMethod = d3.axisLeft;
        // Since the path element moves the axis 0.5 to the bottom, we need to move it 0.5 to the top
        x = 50;
        y = 0;
        dx = '0.5em';
        break;
      default:
        return;
    }

    // The path element always moves the axis 0.5 to the right and bottom, so we need to move it 0.5 to the left and top
    x -= 0.5;
    y -= 0.5;

    const transformString = `translate(${x},${y})`;

    const scale = d3.scalePoint()
      .range([0, 100])
      .domain(domain);

    const axis = axisMethod(scale)
      .tickSize(0);

    d3.select('#' + RadarIdUtil.getAxisId(this.id))
      .append('g')
      .attr('transform', transformString)
      .classed('axis', true)
      .call(axis)
      // Update the text position
      .selectAll('.tick text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '0.5em')
      .attr('dx', dx);
  }

  /**
   * Adds the group for the position circles and their links
   */
  private addCircleGroup(): void {
    this.svgGroup
      .append('g')
      .attr('id', RadarIdUtil.getCircleId(this.id));
  }

  /**
   * Adds the new point to the radar
   * @param point the new point to be drawn on the radar
   */
  addPoint(point: Point): void {
    // TODO: Do we really need this check, or can we not just push it to the array
    const hasPoint = this.points.find(p => point.x === p.x && point.y === p.y);

    // If the point does not exist, add it to the graph
    if (!hasPoint) {
      this.points.push(point);
    } else {
      // TODO: Update the point with the latest information
    }
  }

  /**
   * Draws the points and their links
   */
  redraw(): void {
    this.drawDots();
    this.drawLinks();
  }

  /**
   * Draws the position dots on the radar
   */
  private drawDots(): void {
    // The selector for the 'circles' group element
    const selector = `#${RadarIdUtil.getCircleId(this.id)}`;

    // Append circles, if needed
    const dots = d3.select(selector)
      .selectAll('circle')
      .data(this.points);

    // Update the dots
    // ts-ignore is needed, since 'merge' complains about lines not being of type SVGLineElement
    dots.enter()
      .append('circle')
      // @ts-ignore
      .merge(dots)
      .attr('r', 0.75)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', 'black');

    // Remove unnecessary dots
    dots.exit().remove();
  }

  /**
   * Draws the connecting lines between the dots on the radar
   */
  private drawLinks(): void {
    // The selector for the 'circles' group element
    const selector = `#${RadarIdUtil.getCircleId(this.id)}`;

    const lines = d3.select(selector)
      .selectAll('line')
      .data(this.points);

    // Append lines, if needed
    // ts-ignore is needed, since 'merge' complains about lines not being of type SVGLineElement
    lines
      .enter()
      .append('line')
      // @ts-ignore
      .merge(lines)
      .classed('line', true)
      .attr('x1', (d, i) => i === 0 ? this.center.x : this.points[i - 1].x)
      .attr('y1', (d, i) => i === 0 ? this.center.y : this.points[i - 1].y)
      .attr('x2', d => d.x)
      .attr('y2', d => d.y);

    // Remove unnecessary lines
    lines.exit().remove();
  }

  /**
   * Adjusts the number of displayed equidistant circles
   * @param numOfCircles the number of equidistant circles to be displayed
   */
  private updateNumberOfEquidistantCircles(numOfCircles: number): void {
    const arr = RadarUtil.calculateEquidistantCircleRadii(numOfCircles).reverse();
    const selector = `#${RadarIdUtil.getEquidistantCirclesId(this.id)}`;

    // Append circles, if needed
    const equidistantCircles = d3.select(selector)
      .selectAll('circle')
      .data(arr);

    // Adjust values
    equidistantCircles
      .enter()
      .append('circle')
      // @ts-ignore
      .merge(equidistantCircles)
      .attr('cx', this.center.x)
      .attr('cy', this.center.y)
      .attr('r', d => d)
      .style('fill', (d, i) => RadarUtil.calculateCircleFill(i, numOfCircles))
      .classed('equidistant-circle', true);

    // Remove unnecessary equidistant circles
    equidistantCircles.exit().remove();
  }

  /**
   * Checks if the user rotates the radar via the drag option
   * The user is able to rotate the radar by clicking and dragging inside the radar in the desired direction
   * CTRL + Drag
   */
  private listenToDragRotate(): void {
    const drag = d3.drag()
      .filter(event => event.ctrlKey)
      .on('drag', event => this.radarConfigService.rotateTo(d3.pointer(event)));
    this.svg.call(drag);
  }

  /**
   * Adds a listener for zooming and translating all components of the radar
   */
  private listenToZoom(): void {
    this.zoom = d3.zoom()
      .extent([[0, 0], [100, 100]])
      .scaleExtent([1, 100])
      .on('zoom', ({ transform }) => {
        const transformObj = RadarUtil.getTransformObject(this.svgGroup.attr('transform'));
        this.svgGroup.attr('transform', RadarUtil.buildTransformString(transform.x, transform.y, transform.k, transformObj.r));
      });

    this.svg.call(this.zoom);
  }

  /**
   * Whenever something in the radar config changes, the radar should change
   * Subscribes to all changes in the radar config
   */
  private subscribeToRadarConfigService(): void {
    const zoomSubscription = this.radarConfigService.resetZoomClicked$.subscribe(() => this.resetZoom());
    this.subscriptions.push(zoomSubscription);

    const rotationSubscription = this.radarConfigService.rotationChanged$.subscribe(angleDifference => this.rotate(angleDifference));
    this.subscriptions.push(rotationSubscription);
  }

  /**
   * Resets the zoom changes and centers the SVG
   */
  private resetZoom(): void {
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity, d3.zoomTransform(this.svg.node()).invert([50, 50]));
  }

  /**
   * Rotates the components in the radar
   * @param angleInRadians the angle difference to be rotated in radians
   */
  rotate(angleInRadians: number): void {
    const transform = RadarUtil.getTransformObject(this.svgGroup.attr('transform'));
    const angle = -RadarUtil.toDegrees(angleInRadians);
    this.svgGroup.attr('transform', RadarUtil.buildTransformString(transform.x, transform.y, transform.k, angle));

    d3.selectAll('.axis text')
      .style('transform', `rotate(${angleInRadians}rad)`);
  }

  @HostListener('window:resize')
  private onResize() {
    this.resizeSVGToFitContainer();
  }

  /**
   * Scales the SVG to fit the div and therefore use the most space available
   * This method is used when the window is resize (shrink or expand the SVG when needed)
   */
  private resizeSVGToFitContainer() {
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

  get height(): number {
    return parseInt(d3.select(this.id).style('height'), 10);
  }

  get width(): number {
    return parseInt(d3.select(this.id).style('width'), 10);
  }
}
