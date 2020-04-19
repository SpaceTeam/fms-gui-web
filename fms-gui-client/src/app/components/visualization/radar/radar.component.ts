import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarForm} from '../../../shared/forms/radar.form';

import * as d3 from 'd3';
import {BrushService} from '../../../shared/services/visualization/brush/brush.service';
import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {ResizeObserver} from 'resize-observer';

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
  private margin = 10;
  private resizeObserver: ResizeObserver;

  // TODO: Move the radarform to the flight configuration component
  constructor(private positionService: PositionService, public radarForm: RadarForm, private brushService: BrushService) {
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

  private createRadar(): void {
    this.createRadarContainer();

    // Append the SVG object to the body of the page
    this.createRadarSVG();

    this.addEquidistantCircles();
    // this.addDirections();
  }

  private listenToResize(): void {
    const resizeObserver = new ResizeObserver(() => {
      d3.select(`#${this.id}-container`)
        .style('width', 0)
        .style('height', 0);
      RadarUtil.scaleToSquare(`#${this.id}-container`, RadarUtil.getRadarSize(`#${this.id}`));
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

    RadarUtil.scaleToSquare(`#${this.id}-container`, RadarUtil.getRadarSize(`#${this.id}`));
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the radar
   */
  private createRadarSVG(): void {
    d3.select(`#${this.id}-container`)
      .append('svg')
      .attr('id', `${this.id}-g`)
      .attr('viewBox', '0 0 100 100');
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
      .attr('r', d => d)
      .style('fill', (d, i) => RadarUtil.calculateCircleFill(i, this.numOfCircles))
      .classed('equidistant-circle', true);
  }

  /**
   * Adds the north, west, south, east directions to the radar
   */
  private addDirections(): void {
    const xAxisLabels = ['W', 'E'];
    const yAxisLabels = ['N', 'S'];
    const axisWidth = 100;

    const scaleX = d3.scalePoint()
      .domain(xAxisLabels)
      .range([0, axisWidth]);

    const scaleY = d3.scalePoint()
      .domain(yAxisLabels)
      .range([0, axisWidth]);

    const directions = d3.select(`#${this.id}-g`)
      .append('g')
      .attr('id', `${this.id}-directions`)
      .classed('directions', true);

    // x axis
    directions.append('g')
      .attr('transform', `translate(${this.margin}, ${50})`)
      .call(d3.axisBottom(scaleX).tickSize(0))
      .select('.domain')
      .remove();

    // y axis
    directions.append('g')
      .attr('transform', `translate(${50}, ${this.margin})`)
      .call(d3.axisLeft(scaleY).tickSize(0))
      .select('.domain')
      .remove();
  }
}
