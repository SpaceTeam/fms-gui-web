import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../../shared/model/flight/position';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {PositionUtil} from '../../../shared/utils/position/position.util';
import {environment} from '../../../../environments/environment';
import {RadarForm} from '../../../shared/forms/radar.form';
import {Point} from '../../../shared/model/point.model';

import * as d3 from 'd3';
import {Subscription} from 'rxjs';
import {VisualizationUtil} from '../../../shared/utils/visualization/visualization.util';
import {BrushService} from '../../../shared/services/visualization/brush/brush.service';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit, OnDestroy {

  /**
   * The SVG element's id
   */
  private chartId = 'radar-chart-svg';

  /**
   * The SVG parent's id
   */
  private chartContainerId = 'radar-container';

  /**
   * The size of the container
   */
  private size: number;

  /**
   * The current and previous positions of the flight object
   */
  private readonly positions: Array<Position>;

  /**
   * Custom position
   */
  private center: Position;

  /**
   * The radius of the radar
   */
  private radius: number;

  /**
   * The radar's padding
   */
  private padding: number;

  /**
   * A flag for telling, if the radar configuration window is open
   */
  public isConfigOpen;

  /**
   * The 'rotation' value used for the rotation transformation
   */
  private rotation: number;

  /**
   * Describes the starting point of the vertical axis
   */
  private verticalStartingPoint: Point;

  /**
   * Describes the starting point of the horizontal axis
   */
  private horizontalStartingPoint: Point;

  /**
   * Stores the current maximum altitude of the rocket
   * This value is needed for the calculation of distances between the center and the outer most border
   */
  private maxAltitude: number;

  /**
   * The d3 zoom method
   */
  private zoom;

  private brushRange: {x0: number, x1: number};

  /**
   * An array used for storing subscriptions and, when the component is destroyed, for unsubscribing from the subscriptions
   */
  private subscriptions: Array<Subscription>;

  constructor(private positionService: PositionService, public radarForm: RadarForm, private brushService: BrushService) {
    // Initialize the local objects
    this.positions = [];
    this.maxAltitude = environment.visualization.radar.position.max.altitude;
    this.isConfigOpen = true;
    this.rotation = 0;
    this.subscriptions = [];
    this.resetBrushRange();
  }

  private static createAxisGroupAndSetToStartingPosition(container, id: string, point: Point): any {
    return container.append('g')
      .attr('id', id)
      .attr('class', 'direction')
      .attr('transform', `translate(${point.x}, ${point.y})`);
  }

  /**
   * Sets the position of all texts inside the group to 0
   * @param group the d3 group containing the text elements
   */
  private static setTextPositionToZero(group): void {
    group.selectAll('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dx', 0)
      .attr('dy', 0);
  }

  /**
   * Removes all circles and paths from the radar chart
   */
  private static clearChart(): void {
    d3.selectAll('path.connection').remove();
    d3.selectAll('circle.position').remove();
  }

  /**
   * A method for handling the mouse enter a circle
   * @param d the position of the circle
   * @param i the index of the circle inside the positions array
   * @param circles the array of circle, in which we can find the current circle
   */
  private static handleMouseEnterPositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    const circle = circles[i];
    d3.select(circle).attr('r', environment.visualization.radar.circle.radius * 1.5);
  }

  /**
   * A method for handling the mouse exit of a circle
   * @param d the position of the circle
   * @param i the index of the circle inside the positions array
   * @param circles the array of circle, in which we can find the current circle
   */
  private static handleMouseLeavePositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    const circle = circles[i];
    d3.select(circle).attr('r', environment.visualization.radar.circle.radius);
    d3.select('#tooltip')
      .classed('visible', false)
      .classed('invisible', true);
  }

  ngOnInit() {
    this.brushService.appendBrush();

    this.initChart();

    // Save the current position
    this.subscribeToPositions();

    // Update the center, whenever the center was changed
    this.subscribeToCenterChange();

    // Update the svg, whenever the rotation value was changed
    this.subscribeToRotationChange();

    // Update the svg, whenever the brush has occurred
    this.subscribeToBrushChange();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Initializes the chart, giving it a size and basic configuration (equidistant circles, set the center)
   */
  private initChart(): void {
    const elem = d3.select('#' + this.chartContainerId);
    const svg = elem.insert('svg');

    this.padding = environment.visualization.radar.style.padding;

    const parent = d3.select('#radar-chart-div');

    const containerWidth: number = Number(parent.style('width').slice(0, -2));
    const containerHeight: number = Number(parent.style('height').slice(0, -2));
    this.size = Math.min(containerWidth, containerHeight) - this.padding;
    this.radius = (this.size - 2 * this.padding) / 2;

    // We need to set the width and height, so that the rotation works properly
    // Somehow transform-origin uses the outer most width and height for setting the transform origin
    svg
      .attr('id', this.chartId)
      .attr('width', this.size)
      .attr('height', this.size)
      .attr('viewport', `[0 0 ${this.size} ${this.size}]`);

    // SVG elements
    // Circles
    this.addEquidistantCircles(svg);

    // Add direction texts to the group
    this.setDirectionAxis();

    // Add the altitude text to the group
    this.setAltitudeAxis();

    // Rotation
    const i = d3.interpolateNumber(-1, 1);
    svg.call(d3.drag()
      .filter(() => d3.event.ctrlKey)
      .on('drag', () => this.radarForm.dragRotation(i(d3.event.x / this.size), i(d3.event.y / this.size))));

    // Zoom
    this.zoom = d3.zoom()
      .extent([[0, 0], [this.size, this.size]])
      .scaleExtent([1, 100])
      .on('zoom', () => {
        d3.select('#circles-container').attr('transform', d3.event.transform);
        d3.select('#direction-container').attr('transform', d3.event.transform);
      });
    svg.call(this.zoom);
  }

  private subscribeToPositions(): void {
    this.subscriptions.push(
      this.positionService.positionAnnounced$.subscribe((position: Position) => {
        // Only add the position, if really necessary
        // We need to create a new instance of 'Position', since 'position' is somehow not recognized as a 'Position'
        if (this.positions.filter(pos => PositionUtil.newPosition(pos).equals(position)).length === 0) {
          this.positions.push(position);
          if (position.altitude > this.maxAltitude) {
            this.maxAltitude = position.altitude;
            RadarComponent.clearChart();
            this.setAltitudeAxis();
          }
          this.addPositionsToChart();
          this.brushService.update();
        }
      })
    );
  }

  private subscribeToCenterChange(): void {
    this.subscriptions.push(
      this.radarForm.centerChanged$.subscribe((center: Position) => {
        this.center = center;
        RadarComponent.clearChart();
        this.addPositionsToChart();
      })
    );
    this.radarForm.initCenter();
  }

  private subscribeToRotationChange(): void {
    this.subscriptions.push(
      this.radarForm.rotationChanged$.subscribe((degree: number) => {
        this.rotation = degree;
        this.rotateElements();
      })
    );
  }

  private subscribeToBrushChange(): void {
    this.subscriptions.push(this.brushService.brush$.subscribe(range => {
      RadarComponent.clearChart();
      this.brushRange = range;
      this.addPositionsToChart();
    }));
  }

  /**
   * Adds the equidistant 'circle' elements to the radar (+ the center)
   * @param svg a d3 SVG element
   */
  private addEquidistantCircles(svg): void {
    const equidistantCircles = environment.visualization.radar.equidistant.circles;
    const distance = this.radius / equidistantCircles;
    const radii = [];

    // Add the radii of the circles
    for (let i = 1; i <= equidistantCircles; i++) {
      radii.push(distance * i);
    }
    const interpolation = d3.interpolateNumber(0.1, 0.7);
    const radarSize = 2 * this.radius;

    const circles = svg.append('svg')
      .attr('x', this.padding)
      .attr('y', this.padding)
      .attr('width', radarSize)
      .attr('height', radarSize)
      .attr('viewport', `[-20 -20 ${radarSize + this.padding / 2} ${radarSize + this.padding / 2}]`)
      .attr('id', 'circles-container');

    const g = circles.append('g')
      .attr('id', 'circles');

    // Add the outer circles
    g.selectAll('circle.circles')
      .data(radii.reverse())
      .enter()
      .append('circle')
      .attr('cx', () => this.radius)
      .attr('cy', () => this.radius)
      .attr('r', r => r)
      .style('fill', (d, i) => d3.interpolateGreys(interpolation(i / equidistantCircles)))
      .classed('circles', true);

    // Add the center circle
    g.append('circle')
      .attr('cx', this.radius)
      .attr('cy', this.radius)
      .attr('r', (environment.visualization.radar.circle.radius / 2))
      .classed('center', true);

    // Add the altitude axis group
    circles.append('g')
      .attr('id', 'altitudes');
  }

  /**
   * Adds the 'direction' lines, connecting the center with the directions inside the radar
   */
  private setDirectionAxis(): void {
    const width = Number(d3.select('#circles-container').attr('width'));
    const radius = width / 2;
    const distance = 15;

    const domainVertical: Array<string> = ['N', '', 'S'];
    const domainHorizontal: Array<string> = ['W', '', 'E'];

    const scalePointVertical = d3.scalePoint()
      .domain(domainVertical)
      .range([0, width]);

    const scalePointHorizontal = d3.scalePoint()
      .domain(domainHorizontal)
      .range([0, width]);

    // Set the initial translation values of the axis (the starting points)
    this.horizontalStartingPoint = {x: this.padding, y: radius + this.padding};
    this.verticalStartingPoint = {x: radius + this.padding, y: this.padding};

    const container = d3.select('#' + this.chartId)
      .append('svg')
      .attr('id', 'direction-container');

    // Add a group for the 'horizontal' directions 'W' and 'E'
    const horizontal = RadarComponent.createAxisGroupAndSetToStartingPosition(
      container,
      'direction-horizontal',
      this.horizontalStartingPoint
    );
    horizontal.call(d3.axisBottom(scalePointHorizontal).tickSize(0));

    horizontal.selectAll('g')
      .attr('id', (d: string) => `group-${d}`)
      .attr('transform', (d: string) => `translate(${(d === 'W') ? -distance : width + distance}, 0)`);

    RadarComponent.setTextPositionToZero(horizontal);

    // Add a group for the 'vertical' directions 'N' and 'S'
    const vertical = RadarComponent.createAxisGroupAndSetToStartingPosition(container, 'direction-vertical', this.verticalStartingPoint);
    vertical.call(d3.axisLeft(scalePointVertical).tickSize(0));

    vertical.selectAll('g')
      .attr('id', (d: string) => `group-${d}`)
      .attr('transform', (d: string) => `translate(0, ${(d === 'N') ? -distance : width + distance})`);

    RadarComponent.setTextPositionToZero(vertical);
  }

  /**
   * Adds the 'altitude' text elements to the radar
   */
  private setAltitudeAxis(): void {
    const container = d3.select('#circles-container');
    const width = Number(container.attr('width').slice(0, -2));
    const radius = width / 2;

    const numEquidistantCircles = environment.visualization.radar.equidistant.circles;
    const step = this.maxAltitude / numEquidistantCircles;
    const domain = [''];

    for (let i = 1; i <= numEquidistantCircles; i++) {
      domain.push(`${VisualizationUtil.roundNumberToFixedDecimalPlaces(step * i, 2)}m`);
    }

    const scalePoint = d3.scalePoint()
      .domain(domain)
      .range([radius, width]);

    d3.select('#altitudes')
      .style('transform', `rotateZ(-45deg) translateY(${radius}px)`)
      .style('opacity', 0.8)
      .call(d3.axisBottom(scalePoint).tickSize(0));
  }

  /**
   * Adds everything related to the radar chart to the SVG
   */
  private addPositionsToChart(): void {
    const g = d3.select('#circles');

    const positions: Array<Position> =
      this.positions.filter(position => position.timestamp >= this.brushRange.x0 && position.timestamp <= this.brushRange.x1);

    // Add lines to SVG
    this.drawConnectionLines(g, [this.center, ...positions]);

    // Add circles to SVG
    this.drawDots(g, [...positions]);

    // Re-insert (raise) the circle elements, so that they are always on top
    g.selectAll('circle.position').raise();
  }

  private drawConnectionLines(g, connectionPoints: Array<Position>): void {
    g.selectAll('path.connection')
      .data(connectionPoints)
      .enter()
      .datum(connectionPoints)
      .append('path')
      .attr('class', 'connection')
      .attr('d', d3.line<Position>()
        .x(pos => this.x(pos))
        .y(pos => this.y(pos))
      );
  }

  private drawDots(g, positions: Array<Position>): void {
    g.selectAll('circle.position')
      .data(positions)
      .enter()
      .append('circle')
      .attr('cx', position => this.x(position))
      .attr('cy', position => this.y(position))
      .attr('r', environment.visualization.radar.circle.radius)
      .attr('fill', position => d3.interpolatePlasma((1 / this.maxAltitude) * position.altitude))
      .attr('class', 'position')
      .on('mouseenter', RadarComponent.handleMouseEnterPositionCircle)
      .on('mouseleave', RadarComponent.handleMouseLeavePositionCircle)
      .append('title')
      .html(position => PositionUtil.newPosition(position).toString());
  }

  /**
   * Performs the rotation of the SVG elements
   */
  private rotateElements(): void {
    // [*,*] => [0, 360]
    let value = this.rotation;
    while (value < 0) {
      value += 360;
    }
    while (value > 360) {
      value -= 360;
    }

    // Transform the circles
    d3.select('#circles').style('transform', `rotateZ(${value}deg)`);

    // Transform text axis
    const rotation = `rotateZ(${value}deg)`;
    d3.select('#direction-vertical')
      .style('transform', rotation +
        `translateX(${this.verticalStartingPoint.x}px) translateY(${this.verticalStartingPoint.y}px)`)
      .selectAll('text').style('transform', `rotateZ(-${value}deg)`);
    d3.select('#direction-horizontal')
      .style('transform', rotation +
        ` translateX(${this.horizontalStartingPoint.x}px) translateY(${this.horizontalStartingPoint.y}px)`)
      .selectAll('text').style('transform', `rotateZ(-${value}deg)`);
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
   * Expands or collapses the configuration window in the radar component
   */
  toggleConfiguration(): void {
    const icon = <HTMLElement>document.getElementById('toggle-icon');
    this.isConfigOpen = !this.isConfigOpen;

    const visualizationName = 'radar';

    if (icon.innerText === 'keyboard_arrow_down') {
      icon.innerText = 'keyboard_arrow_right';
      icon.title = `Expand ${visualizationName} configuration`;
    } else {
      icon.innerText = 'keyboard_arrow_down';
      icon.title = `Collapse ${visualizationName} configuration`;
    }
  }

  /**
   * Resets the zoom
   */
  private resetZoom(): void {
    const svg = d3.select('#' + this.chartId);
    const node = <Element>svg.node();
    svg.transition().duration(750).call(
      this.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(node).invert([this.size / 2, this.size / 2])
    );
  }

  private resetBrushRange(): void {
    this.brushRange = {x0: 0, x1: Infinity};
  }
}
