import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../shared/model/flight/position';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {PositionUtil} from '../../shared/utils/position/position.util';
import {environment} from '../../../environments/environment';
import {RadarForm} from '../../shared/forms/radar.form';

import * as d3 from 'd3';
import {Subscription} from 'rxjs';

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
  private chartContainerId = 'radar-chart-div';

  /**
   * The size of the container
   */
  private size: number;

  /**
   * The current and previous positions of the flight object
   */
  private positions: Array<Position>;

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
   * Contains ['N', 'W', 'S', 'E'] and their positions
   */
  private directions: Array<{name: string, x: number, y: number}>;

  /**
   * The interpolator for the transformation in the range [0,1]
   */
  private rotationI;

  /**
   * The reversed interpolator for getting the right values for the SVG
   */
  private rotationRI;

  /**
   * A flag for telling, if the radar configuration window is open
   */
  private isConfigOpen;

  /**
   * The 'translation' values used for the translation transformation
   */
  private translation: {x: number, y: number};

  /**
   * The 'rotation' value used for the rotation transformation
   */
  private rotation: number;

  /**
   * The 'scale' value used for the scale transformation
   */
  private scale: number;

  /**
   * Stores the current maximum altitude of the rocket
   * This value is needed for the calculation of distances between the center and the outer most border
   */
  private maxAltitude: number;

  /**
   * The d3 zoom method
   */
  private zoom;

  /**
   * An array used for storing subscriptions and, when the component is destroyed, for unsubscribing from the subscriptions
   */
  private subscriptions: Array<Subscription>;

  constructor(private positionService: PositionService, private radarForm: RadarForm) {
    // Initialize the local objects
    this.positions = [];
    this.maxAltitude = environment.visualization.radar.position.max.altitude;
    this.isConfigOpen = true;
    this.translation = {x: 0, y: 0};
    this.scale = 1;
    this.rotation = 0;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.initChart();

    // Save the current position
    this.subscribeToPositions();

    // Update the center, whenever the center was changed
    this.subscribeToCenterChange();

    // Update the svg, whenever the translation value was changed
    // this.subscribeToTranslationChange();

    // Update the svg, whenever the rotation value was changed
    this.subscribeToRotationChange();

    // Update the svg, whenever the scale value was changed
    // this.subscribeToScaleChange();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Initializes the chart, like giving it a size and basic configuration (equidistant circles, set the center)
   */
  private initChart(): void {
    const elem = d3.select('#' + this.chartContainerId);
    const svg = elem.insert('svg', ':first-child');

    svg.attr('width', '100%');

    this.padding = environment.visualization.radar.style.padding;
    this.size = Math.min(Number(svg.style('width').slice(0, -2)), Number(svg.style('height').slice(0, -2)));
    this.radius = (this.size - 2 * this.padding) / 2;

    this.rotationI = d3.interpolate(-1, 1);
    this.rotationRI = d3.interpolate(0, this.size);

    // We need to set the width and height, so that the rotation works properly
    // Somehow transform-origin uses the outer most width and height for setting the transform origin
    svg
      .attr('id', this.chartId)
      .attr('width', this.size)
      .attr('height', this.size)
      .attr('viewport', `[0 0 ${this.size} ${this.size}]`);

    // SVG elements
    // Circles
    this.addCircles(svg);

    // Add direction text to the group
    this.addDirectionText(svg);

    // Add direction lines to the group
    this.addDirectionLines();

    // Rotation
    const i = d3.interpolateNumber(-1, 1);
    svg.call(d3.drag()
      .filter(() => d3.event.ctrlKey)
      .on('drag', () => this.radarForm.dragRotation(i(d3.event.x / this.size), i(d3.event.y / this.size))));

    // Zoom
    this.zoom = d3.zoom()
      .extent([[0, 0], [this.size, this.size]])
      .scaleExtent([1, 10])
      .on('zoom', () => {
        d3.select('#circles-container').attr("transform", d3.event.transform);
        d3.select('#text-container').attr("transform", d3.event.transform);
      });
    svg.call(this.zoom);
  }

  /**
   * Lets the radar listen to incoming positions
   */
  private subscribeToPositions(): void {
    this.subscriptions.push(
      this.positionService.positionAnnounced$.subscribe((position: Position) => {
        // Only add the position, if really necessary
        if (this.positions.filter(pos => PositionUtil.newPosition(pos).equals(position)).length === 0) {
          this.positions.push(position);
          if (position.altitude > this.maxAltitude) {
            this.maxAltitude = position.altitude;
            RadarComponent.clearChart();
          }
          this.addPositionsToChart();
        }
      })
    );
  }

  /**
   * Lets the radar listen to incoming center changes
   */
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

  /**
   * Lets the radar listen to incoming translation changes
   */
  private subscribeToTranslationChange(): void {
    this.subscriptions.push(
      this.radarForm.translationChanged$.subscribe((translation: { x: number, y: number }) => {
        this.translation = translation;
        this.transformElements();
      })
    );
  }

  /**
   * Lets the radar listen to incoming rotation changes
   */
  private subscribeToRotationChange(): void {
    this.subscriptions.push(
      this.radarForm.rotationChanged$.subscribe((degree: number) => {
        this.rotation = degree;
        this.transformElements();
      })
    );
  }

  /**
   * Lets the radar listen to incoming scale changes
   */
  private subscribeToScaleChange(): void {
    this.subscriptions.push(
      this.radarForm.scaleChanged$.subscribe((value: number) => {
        this.scale = value;
        this.transformElements();
      })
    );
  }

  /**
   * Performs the transformation of the SVG elements
   */
  private transformElements(): void {
    // Transform the circles
    d3.select('#circles')
      .style('transform', `translate(${this.translation.x}px, ${this.translation.y}px) scale(${this.scale}) rotateZ(${this.rotation}deg)`);

    // Transform text position
    d3.select('#texts')
      .selectAll('text.direction')
      .data(this.directions)
      .attr('x', d => this.transformX(d))
      .attr('y', d => this.transformY(d))
      .text(d => d.name);
  }

  /**
   * Adds the 'circle' elements to the radar
   * @param svg a d3 SVG element
   */
  private addCircles(svg): void {
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
      .attr('viewport', `[0 0 ${radarSize} ${radarSize}]`)
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
  }

  /**
   * Adds the 'direction' text elements to the radar
   * @param svg a d3 SVG element
   */
  private addDirectionText(svg): void {
    const texts = svg.append('svg')
      .attr('id', 'g-text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.size)
      .attr('height', this.size)
      .attr('id', 'text-container');

    const t = texts.append('g')
      .attr('id', 'texts');

    this.directions = [
      {
        name: 'N',
        x: this.size / 2,
        y: this.padding / 2
      },
      {
        name: 'W',
        x: this.padding / 2,
        y: this.size / 2
      },
      {
        name: 'E',
        x: this.size - this.padding / 2,
        y: this.size / 2
      },
      {
        name: 'S',
        x: this.size / 2,
        y: this.size - this.padding / 2
      }
    ];

    t.selectAll('text.direction')
      .data(this.directions)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .text(d => d.name)
      .classed('direction', true);
  }

  /**
   * Adds the 'direction' lines, connecting the center with the directions inside the radar
   */
  private addDirectionLines(): void {
    const w = Number(d3.select('#circles-container').attr('width'));
    const lines = [
      // N
      {
        x: w / 2,
        y: 0
      },
      // S
      {
        x: w / 2,
        y: w
      },
      // W
      {
        x: 0,
        y: w / 2
      },
      // E
      {
        x: w,
        y: w / 2
      }
    ];

    d3.select('#circles')
      .selectAll('line.direction')
      .data(lines)
      .enter()
      .append('line')
      .attr('x1', this.transformX({x: w / 2, y: w / 2}))
      .attr('y1', this.transformY({x: w / 2, y: w / 2}))
      .attr('x2', d => this.transformX(d))
      .attr('y2', d => this.transformY(d))
      .classed('direction', true);
  }

  /**
   * Removes all circles and paths from the radar chart
   */
  private static clearChart(): void {
    d3.selectAll('path.connection').remove();
    d3.selectAll('circle.position').remove();
  }

  /**
   * Adds everything related to the radar chart to the SVG
   */
  private addPositionsToChart(): void {
    const g = d3.select('#circles');

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
      .on('mouseenter', RadarComponent.handleMouseEnterPositionCircle)
      .on('mouseleave', RadarComponent.handleMouseLeavePositionCircle)
      .append('title')
      .html(position => `(lat: ${position.latitude}, lon: ${position.longitude}, alt: ${position.altitude})`);

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
  private static handleMouseEnterPositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    const circle = circles[i];
    d3.select(circle).attr('r', circle.r.baseVal.value * 1.5);
  }

  /**
   * A method for handling the mouse exit of a circle
   * @param d the position of the circle
   * @param i the index of the circle inside the positions array
   * @param circles the array of circle, in which we can find the current circle
   */
  private static handleMouseLeavePositionCircle(d: Position, i: number, circles: SVGCircleElement[]): void {
    const circle = circles[i];
    d3.select(circle).attr('r', circle.r.baseVal.value / 1.5);
    d3.select('#tooltip').classed('visible', false).classed('invisible', true);
  }

  /**
   * Performs all geometric transformations (in x-direction) for the text inside the radar
   * @param d the object containing information about a given direction
   */
  private transformX(d: {x: number, y: number}): number {
    let x = this.rotationI(d.x / this.size);
    let y = this.rotationI(d.y / this.size);

    // Rotate
    x = x * Math.cos(this.rotation * Math.PI / 180) - y * Math.sin(this.rotation * Math.PI / 180);

    // Scale
    // x *= this.scale;

    // We add '1' and divide by 2, so that all numbers in the range [-1;1] are between [0;1]
    // Translate (in px)
    return this.rotationRI((x + 1) / 2); // + this.translation.x;
  }

  /**
   * Performs all geometric transformations (in y-direction) for the text inside the radar
   * @param d the object containing information about a given direction
   */
  private transformY(d: {x: number, y: number}): number {
    let x = this.rotationI(d.x / this.size);
    let y = this.rotationI(d.y / this.size);

    // Rotate
    y = x * Math.sin(this.rotation * Math.PI / 180) + y * Math.cos(this.rotation * Math.PI / 180);

    // Scale
    // y *= this.scale;

    // Translate (in px)
    return this.rotationRI((y + 1) / 2); // + this.translation.y;
  }

  /**
   * Expands or collapses the configuration window in the radar component
   */
  private toggleConfiguration(): void {
    const icon = document.getElementById('toggle-icon');
    this.isConfigOpen = !this.isConfigOpen;

    if (icon.innerText === 'keyboard_arrow_down') {
      icon.innerText = 'keyboard_arrow_right';
      icon.title = 'Expand radar configuration';
    } else {
      icon.innerText = 'keyboard_arrow_down';
      icon.title = 'Collapse radar configuration';
    }
  }

  /**
   * Resets the zoom
   */
  private resetZoom() {
    const svg = d3.select('#' + this.chartId);
    const node = <Element>svg.node();
    svg.transition().duration(750).call(
      this.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(node).invert([this.size / 2, this.size / 2])
    );
  }
}
