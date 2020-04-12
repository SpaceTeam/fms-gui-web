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

  // TODO: Use the positioning behaviour of the dots from the "flight-direction" and "flight-position" components

  private margin = 10;

  constructor(private positionService: PositionService, public radarForm: RadarForm, private brushService: BrushService) {
    this.numOfCircles = environment.visualization.radar.equidistant.circles;
  }

  ngOnInit() {
    // Append the SVG object to the body of the page
    this.createRadarSVG();

    this.addEquidistantCircles();
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the radar
   */
  private createRadarSVG(): void {
    d3.select(`#${this.id}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('id', `${this.id}-g`)
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
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
      .attr('cx', () => this.getComponentWidth() / 2)
      .attr('cy', () => this.getComponentHeight() / 2)
      .attr('r', d => d)
      .classed('equidistant-circle', true);
  }

  /**
   * Calculates the radii for the correct drawing of the equidistant circles
   */
  private calculateEquidistantCircleRadii(): Array<number> {
    const circleRadii = [];
    const width = this.getComponentWidth();
    const height = this.getComponentHeight();
    const center = width < height ? width / 2 : height / 2;

    const r = center / this.numOfCircles;
    for (let i = 1; i <= this.numOfCircles; i++) {
      circleRadii[i] = r * i;
    }
    return circleRadii;
  }

  /**
   * Returns the width we use for the radar (not the actual svg width!)
   */
  private getComponentWidth(): number {
    const parent = d3.select(`#${this.id}`);
    return Number(parent.style('width').slice(0, -2)) - 2 * this.margin;
  }

  /**
   * Returns the height we use for the radar (not the actual svg height!)
   */
  private getComponentHeight(): number {
    const parent = d3.select(`#${this.id}`);
    return Number(parent.style('height').slice(0, -2)) - 2 * this.margin;
  }
}
