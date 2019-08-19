import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {NameValuePairUtils} from '../shared/utils/NameValuePairUtils';
import {NameValuePair} from '../shared/model/name-value-pair/name-value-pair.model';
import * as d3 from 'd3';
import {Position} from '../shared/model/flight/position';

@Component({
  selector: 'app-flight-mode',
  templateUrl: './flight-mode.component.html',
  styleUrls: ['./flight-mode.component.scss']
})
export class FlightModeComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  private title = 'Flight mode';

  /**
   * The main SVG element's id
   */
  private chartId = 'flight-chart-svg';

  /**
   * The GNSS object, containing the flight data
   */
  gnss: Array<Array<NameValuePair>>;

  /**
   * The current and previous positions of the flight object
   */
  private positions: Array<Position>;

  constructor(private fmsDataService: FmsDataService) {
  }

  ngOnInit() {
    // Initialize the local objects
    this.gnss = [];
    this.positions = [];

    this.initChart();

    // Wait for the FMS data to be present
    this.fmsDataService.presentSubject.asObservable().subscribe(isPresent => {
      if (isPresent) {
        // Save the current GNSS object in the local GNSS object
        let currentGNSS = NameValuePairUtils.castToArray(this.fmsDataService.getValue('GNSS'))
          .filter(val => val.name !== 'GetLastMessage');

        // Modifies the chart
        this.saveNewPosition();
        this.addPositionsToChart();

        // We unshift the array, since we want the current GNSS data to be the first in the array
        this.gnss.unshift(currentGNSS);
      }
    });
  }

  private initChart(): void {
    const svg = d3.select('#flight-mode-chart').append('svg');
    // TODO: Implement me correctly!
  }

  /**
   * Adds the current position of the FMS service to the 'positions' array
   */
  private saveNewPosition(): void {
    let longitude: number = <number>this.fmsDataService.getValue('GNSS/longitude');
    let latitude: number = <number>this.fmsDataService.getValue('GNSS/latitude');
    let altitude: number = <number>this.fmsDataService.getValue('GNSS/altitude');
    let timestamp: number = <number>this.fmsDataService.getValue('Status/FMSTimestamp');
    let position: Position = {longitude, latitude, altitude, timestamp};

    // Only add the element, if it is not existent yet
    if (!this.positions.includes(position)) {
      this.positions.push(position);
    }
  }

  private addPositionsToChart(): void {
    const svg = d3.select('#' + this.chartId);

    // Add lines to SVG
    // TODO: Make this work
    /*
    svg.selectAll('path')
      .data(d => this.positions)
      .enter()
      .append('path')
      .attr('class', 'position')
      .style('fill', 'red')
      .attr('d', null);
     */

    // Add circles to SVG
    // TODO: Make this work
    /*
    svg.selectAll('circle')
      .data(this.positions)
      .enter()
      .append('circle')
      .attr('cx', position => this.CENTER.x + position.longitude)
      .attr('cy', position => this.CENTER.y + position.latitude)
      .attr('r', '0.5em')
      .attr('fill', 'red');

     */
  }
}
