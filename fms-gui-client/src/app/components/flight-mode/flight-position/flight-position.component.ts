import {AfterViewInit, Component, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarComponent} from '../../visualization/radar/radar.component';
import {AxisEnum} from '../../../shared/enums/axis.enum';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-flight-position',
  templateUrl: './flight-position.component.html',
  styleUrls: ['./flight-position.component.scss']
})
export class FlightPositionComponent implements AfterViewInit {

  @ViewChild(RadarComponent)
  private radar: RadarComponent;

  private latitudeScale: d3.ScaleLinear<number, number>;
  private longitudeScale: d3.ScaleLinear<number, number>;
  private xAxis: d3.Axis<any>;
  private yAxis: d3.Axis<any>;

  constructor(private positionService: PositionService) {
  }

  ngAfterViewInit(): void {
    this.initScalesAndAxis();
    this.setAxis();
  }

  /**
   * Initializes the scales, which are used for the positioning of the dots
   */
  private initScalesAndAxis(): void {
    const numOfTicks = environment.visualization.radar.equidistant.circles * 2;

    this.latitudeScale = d3.scaleLinear()
      .domain([-90, 90])
      .range([0, 100]);

    this.longitudeScale = d3.scaleLinear()
      .domain([-180, 180])
      .range([0, 100]);

    this.xAxis = d3.axisBottom(this.longitudeScale)
      .tickSize(0)
      .ticks(numOfTicks);

    this.yAxis = d3.axisLeft(this.latitudeScale)
      .tickSize(0)
      .ticks(numOfTicks);
  }

  /**
   * Sets the axis for the flight-position component
   */
  private setAxis(): void {
    this.radar.setAxis(this.xAxis, AxisEnum.X_AXIS);
    this.radar.setAxis(this.yAxis, AxisEnum.Y_AXIS);
  }
}
