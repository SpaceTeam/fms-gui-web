import { Component, OnInit } from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {FMSData} from '../shared/model/fms-data/fms-data.model';
import {interval} from 'rxjs';

@Component({
  selector: 'app-flightmode',
  templateUrl: './flightmode.component.html',
  styleUrls: ['./flightmode.component.scss']
})
export class FlightmodeComponent implements OnInit {
  title = 'Flight mode';

  fmsData: FMSData;

  /**
   * The timer, which tells how often a given function should be called
   * TODO: get the interval from a properties / yaml file
   */
  source = interval(1000);

  constructor(private fmsDataService: FmsDataService) { }

  ngOnInit() {
    this.source.subscribe(() => this.loadFMSData());
  }

  /**
   * Get the current FMS data and save it in the fmsData object
   */
  loadFMSData(): void {
    this.fmsDataService.getData()
      .subscribe(fmsData => this.fmsData = fmsData);  // Subscribe tells what to do with the callback
  }

}
