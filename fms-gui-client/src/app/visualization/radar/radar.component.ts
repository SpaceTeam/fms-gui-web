import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Position} from '../../shared/model/flight/position';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadarComponent implements OnInit {

  /**
   * The SVG element's id
   */
  private chartId = 'radar-chart-svg';

  /**
   * The SVG container's id
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

  constructor(private positionService: PositionService) {
    // Initialize the local objects
    this.positions = [];
  }

  ngOnInit() {
    this.initChart();

    // Save the current position
    this.positionService.positionAnnounced$.subscribe(position => {
      // Only add the position, if really necessary
      if (!this.positions.includes(position)) {
        this.positions.push(position);
      }
      this.addPositionsToChart();
    });
  }

  private initChart(): void {
    const elem = d3.select('#' + this.chartContainerId);
    const svg = elem.append('svg');

    this.size = Math.min(Number(elem.style('width').slice(0, -2)), Number(elem.style('height').slice(0, -2)));


    svg.attr('width', this.size);
    svg.attr('height', this.size);
    svg.attr('id', this.chartId);

    // Set the center of the SVG
    // TODO: Let the user decide what the center should be
    this.center = {
      longitude: 0,
      latitude: 0,
      altitude: 0,
      timestamp: 0
    };

    svg
      .data([this.center])
      .append('circle')
      .attr('cx', position => this.calculateLongitude(position.longitude))
      .attr('cy', position => this.calculateLatitude(position.latitude))
      .attr('r', '0.1em');

    svg
      .data([this.center])
      .append('circle')
      .attr('cx', position => this.calculateLongitude(position.longitude))
      .attr('cy', position => this.calculateLatitude(position.latitude))
      .attr('r', this.size / 2)
      .classed('circles', true);
  }

  private addPositionsToChart(): void {
    const svg = d3.select('#' + this.chartId);

    // Add lines to SVG
    // TODO: They should go from one position to the other (except the first one)

    // TODO: Let the user switch between (0,0) as the center and the first (lon,lat) as the center

    // Add circles to SVG
    svg.selectAll('circle')
      .data([this.center, this.center, ...this.positions])
      .enter()
      .append('circle')
      .attr('cx', position => this.calculateLongitude(position.longitude))
      .attr('cy', position => this.calculateLatitude(position.latitude))
      .attr('r', '0.25em')
      .attr('class', 'position');
  }


  /**
   * Calculates the longitude position of the point in the diagram with the given longitude
   * @param longitude the position's longitude
   * @return the longitude position in the diagram
   */
  private calculateLongitude(longitude: number): number {
    const longitudeStep: number = this.size / 360;

    // Calculate the longitude from the center of the visualization (vertical and horizontal)
    return this.center.longitude + longitude * longitudeStep;
  }

  /**
   * Calculates the latitude position of the point in the diagram with the given latitude
   * @param latitude the position's latitude
   * @return the latitude position in the diagram
   */
  private calculateLatitude(latitude: number): number {
    const latitudeStep: number = this.size / 180;

    // Calculate the latitude from the center of the visualization (vertical and horizontal)
    // We define 'Minus', since the y-Axis is shifted per default
    return this.center.latitude - latitude * latitudeStep;
  }
}
