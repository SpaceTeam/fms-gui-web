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
// TODO: You should be able to zoom into the region where your mouse is, not a random zoom
// TODO: Add the distances to the radar
// TODO: Add tooltips to each dot
@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit, AfterViewInit {

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
   * Stores the points to be drawn on the radar
   */
  private readonly points: Array<Point>;

  private x: d3.ScalePoint<string>;
  private y: d3.ScalePoint<string>;

  constructor(private radarConfigService: RadarConfigService) {
    this.center = new Point(50, 50);
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

    this.initScales();
    this.addAxisGroups();
    this.addCircleGroup();
    this.addPathGroup();
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

  private initScales(): void {
    const xDomain = ['W', 'E'];
    const yDomain = ['N', 'S'];

    const range = [0, 100];

    this.x = d3.scalePoint()
      .domain(xDomain)
      .range(range);

    this.y = d3.scalePoint()
      .domain(yDomain)
      .range(range);
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
    let axisMethod;
    let dx: string;
    let x = 0;
    let y = 0;
    let scale;
    let axis;
    let id: string;

    switch (axisEnum) {
      case AxisEnum.X_AXIS:
        axisMethod = d3.axisBottom;
        scale = this.x;
        x = 0;
        y = 50;
        dx = '';
        axis = RadarUtil.xAxis;
        id = 'x-axis';
        break;
      case AxisEnum.Y_AXIS:
        axisMethod = d3.axisLeft;
        scale = this.y;
        // Since the path element moves the axis 0.5 to the bottom, we need to move it 0.5 to the top
        x = 50;
        y = 0;
        dx = '0.5em';
        axis = RadarUtil.yAxis;
        id = 'y-axis';
        break;
      default:
        return;
    }

    // The path element always moves the axis 0.5 to the right and bottom, so we need to move it 0.5 to the left and top
    x -= 0.5;
    y -= 0.5;

    d3.select('#' + RadarIdUtil.getAxisId(this.id))
      .append('g')
      .attr('id', id)
      .call(axis, scale, `translate(${x},${y})`)
      .call(RadarUtil.updateTextPosition, dx);
  }

  /**
   * Adds the group for the position circles and their links
   */
  private addCircleGroup(): void {
    this.svgGroup
      .append('g')
      .attr('id', RadarIdUtil.getCircleId(this.id));
  }

  private addPathGroup(): void {
    const pathGroup = this.svgGroup
      .append('g')
      .attr('id', RadarIdUtil.getPathId(this.id));

    // We only have one path, therefore we append it already here
    pathGroup.append('path');
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
   * TODO: Somehow the circles are only added, but never removed when the center changes! Needs to be fixed
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
   * TODO: Maybe instead of drawing links, we could use a path element and redraw it with the dots as their base
   * -> only one element instead of n
   */
  private drawLinks(): void {
    // The selector for the 'circles' group element
    const selector = `#${RadarIdUtil.getPathId(this.id)}`;

    const data = [this.center, ...this.points];
    const p = d3.line()(data.map(point => [point.x, point.y]));

    const paths = d3.select(selector)
      .select('path')
      .data([])
      .classed('line', true)
      .attr('d', p);
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
      .on('drag', event => {
        // Get the point inside the radar where we started the drag (between 0 and 100 with the second parameter)
        const [x, y] = d3.pointer(event, this.svg.node());
        const point = RadarUtil.toCartesian(new Point(x, y), this.center);
        // We need two pi, so that the angle is always positive
        this.radarConfigService.publishNewRotation(Math.atan2(point.y, point.x) + 2 * Math.PI);
      });
    this.svg.call(drag);
  }

  /**
   * Adds a listener for zooming and translating all components of the radar
   * TODO: Fix the zooming (zooms randomly, but not where the pointer is)
   */
  private listenToZoom(): void {
    this.zoom = d3.zoom()
      .scaleExtent([1, 100])
      .on('zoom', ({ transform }) => {
        const transformObj = RadarUtil.getTransformObject(this.svgGroup.attr('transform'));
        this.svgGroup.attr('transform', RadarUtil.buildTransformString(transform.x, transform.y, transform.k, transformObj.r));

        // TODO: There is no 'invert' for d3.scalePoint -> you have to come up with another solution!
        // const zx = transform.rescaleX(this.x);
        // const zy = transform.rescaleY(this.y);

      });

    this.svg.call(this.zoom);
  }

  /**
   * Resets the zoom changes and centers the SVG
   */
  resetZoom(): void {
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
