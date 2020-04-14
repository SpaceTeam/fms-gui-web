import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarForm} from '../../../shared/forms/radar.form';

import * as d3 from 'd3';
import {BrushService} from '../../../shared/services/visualization/brush/brush.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit {

  @Input()
  private id: string;

  private numOfCircles: number;
  private margin = 10;

  // TODO: Use the positioning behaviour of the dots from the "flight-direction" and "flight-position" components

  // TODO: Move the radarform to the flight configuration component
  constructor(private positionService: PositionService, public radarForm: RadarForm, private brushService: BrushService) {
    this.numOfCircles = environment.visualization.radar.equidistant.circles;
  }

  ngOnInit() {
    // Append the SVG object to the body of the page
    this.createRadarSVG();

    this.addEquidistantCircles();
    this.addDirections();
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the radar
   */
  private createRadarSVG(): void {
    d3.select(`#${this.id}`)
      .append('svg')
      .attr('width', () => this.getRadarSize())
      .attr('height', () => this.getRadarSize())
      .append('g')
      .attr('id', `${this.id}-g`);
  }

  /**
   * Adds the equidistant circles
   */
  private addEquidistantCircles(): void {
    d3.select(`#${this.id}-g`)
      .append('g')
      .attr('id', `${this.id}-equidistant-circles`)
      .selectAll('circle')
      .data(this.calculateEquidistantCircleRadii().reverse())
      .enter()
      .append('circle')
      .attr('cx', () => this.getCenter())
      .attr('cy', () => this.getCenter())
      .attr('r', d => d)
      .style('fill', (d, i) => this.calculateCircleFill(i))
      .style('opacity', '50%')
      .classed('equidistant-circle', true);
  }

  /**
   * Calculates the radii for the correct drawing of the equidistant circles
   */
  private calculateEquidistantCircleRadii(): Array<number> {
    const circleRadii = [];
    const center = this.getCenter() - 2 * this.margin;

    const r = Math.floor(center / this.numOfCircles);
    for (let i = 1; i <= this.numOfCircles; i++) {
      circleRadii[i] = r * i;
    }
    return circleRadii;
  }

  /**
   * Calculates the background color (fill) for each of the equidistant circles
   * @param index the index of the equidistant circle
   */
  private calculateCircleFill(index: number): string {
    const colorNumberInterpolate = d3.interpolateNumber(0.1, 0.7);
    return d3.interpolateGreys(colorNumberInterpolate(index / this.numOfCircles));
  }

  /**
   * Adds the north, west, south, east directions to the radar
   */
  private addDirections(): void {
    const xAxisLabels = ['W', 'E'];
    const yAxisLabels = ['N', 'S'];
    const axisWidth = this.getRadarSize() - 2 * this.margin;

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
      .attr('transform', `translate(${this.margin}, ${this.getCenter()})`)
      .call(d3.axisBottom(scaleX).tickSize(0))
      .select('.domain')
      .remove();

    // y axis
    directions.append('g')
      .attr('transform', `translate(${this.getCenter()}, ${this.margin})`)
      .call(d3.axisLeft(scaleY).tickSize(0))
      .select('.domain')
      .remove();
  }

  /**
   * Returns the center of the radar SVG
   */
  private getCenter(): number {
    return Math.floor(this.getRadarSize() / 2);
  }

  /**
   * Returns the window size for the actual radar
   */
  private getRadarSize(): number {
    const parent = d3.select(`#${this.id}`);

    const width = Number(parent.style('width').slice(0, -2));
    const height = Number(parent.style('height').slice(0, -2));

    return Math.floor(width < height ? width : height);
  }
}
