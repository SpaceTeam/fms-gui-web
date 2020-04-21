import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {RadarForm} from '../../../shared/forms/radar.form';

import * as d3 from 'd3';
import {BrushService} from '../../../shared/services/visualization/brush/brush.service';
import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {ResizeObserver} from 'resize-observer';
import {AxisEnum} from '../../../shared/enums/axis.enum';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit, OnDestroy {

  @Input()
  private id: string;

  private numOfCircles: number;
  private resizeObserver: ResizeObserver;

  // TODO: Move the radarform to the flight configuration component
  constructor(public radarForm: RadarForm, private brushService: BrushService) {
    this.numOfCircles = environment.visualization.radar.equidistant.circles;
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

    this.addEquidistantCircles();
    this.addDirections();
    this.addAxisGroups();
  }

  /**
   * Checks if the browser gets resized and adjusts the container size according to the new available width and height
   */
  private listenToResize(): void {
    const resizeObserver = new ResizeObserver(() => {
      d3.select(`#${this.id}-container`)
        .style('width', 0)
        .style('height', 0);
      RadarUtil.scaleToSquare(`#${this.id}-container`, RadarUtil.getMinimumSideLength(`#${this.id}`));
    });
    resizeObserver.observe(document.querySelector('body'));
  }

  /**
   * Appends a div to the radar component, which we can resize according to the radar dimensions
   */
  private createRadarContainer(): void {
    d3.select(`#${this.id}`)
      .append('div')
      .attr('id', `${this.id}-container`);

    RadarUtil.scaleToSquare(`#${this.id}-container`, RadarUtil.getMinimumSideLength(`#${this.id}`));
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the radar
   */
  private createRadarSVG(): void {
    d3.select(`#${this.id}-container`)
      .append('svg')
      .attr('viewBox', '0 0 100 100')
      .append('g')
      .attr('id', `${this.id}-g`)
      .classed('radar-group', true);
  }

  /**
   * Adds the equidistant circles
   */
  private addEquidistantCircles(): void {
    d3.select(`#${this.id}-g`)
      .append('g')
      .attr('id', `${this.id}-equidistant-circles`)
      .classed('circle-group', true)
      .selectAll('circle')
      .data(RadarUtil.calculateEquidistantCircleRadii(this.numOfCircles).reverse())
      .enter()
      .append('circle')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', d => d - 0.05) // We need to subtract half of the stroke-width so that it fits the svg perfectly
      .style('fill', (d, i) => RadarUtil.calculateCircleFill(i, this.numOfCircles))
      .classed('equidistant-circle', true);
  }

  /**
   * Adds the north, west, south, east directions to the radar
   */
  private addDirections(): void {
    d3.select(`#${this.id}-g`)
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
    const axisGroup = d3.select(`#${this.id}-g`)
      .append('g')
      .attr('id', `${this.id}-axis-group`);

    // Create the x-axis group
    const xAxis = axisGroup
      .append('g')
      .attr('id', `${this.id}-${AxisEnum.X_AXIS}`)
      .classed('axis', true)
      .classed('x-axis', true);

    // Append the correct domain line
    xAxis.append('line')
      .attr('x1', 0)
      .attr('x2', 100)
      .attr('y1', 0)
      .attr('y2', 0);

    // Create the y-axis group
    const yAxis = axisGroup
      .append('g')
      .attr('id', `${this.id}-${AxisEnum.Y_AXIS}`)
      .classed('axis', true)
      .classed('y-axis', true);

    // Append the correct domain line
    yAxis.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', 100);

    // Create the diagonal axis group
    axisGroup
      .append('g')
      .attr('id', `${this.id}-${AxisEnum.DIAGONAL_AXIS}`)
      .classed('axis', true)
      .classed('diagonal-axis', true);
  }

  /**
   * Calls the given axis on the axis group with the given id
   *
   * @param axis the axis to be called on the axis-group
   * @param axisEnum the selector of the axis group
   */
  setAxis(axis: d3.Axis<any>, axisEnum: AxisEnum): void {
    d3.select(`#${this.id}-${axisEnum}`)
      .call(axis)
      .select('.domain').remove();
  }
}
