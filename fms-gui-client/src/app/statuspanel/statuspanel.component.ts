import { Component, OnInit } from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {FMSData} from '../shared/model/fms-data.model';
import {interval} from 'rxjs';

@Component({
  selector: 'app-statuspanel',
  templateUrl: './statuspanel.component.html',
  styleUrls: ['./statuspanel.component.scss']
})
export class StatuspanelComponent implements OnInit {
  title = 'Status Panel';

  /**
   * The FMSData object containing the current FMS data
   */
  fmsData: FMSData;

  /**
   * The date object when the fms data was retrieved
   */
  date: Date;

  /**
   * The timer, which tells how often a given function should be called
   * TODO: get the interval from a properties / yaml file
   */
  source = interval(1000);

  constructor(
    private fmsDataService: FmsDataService
  ) { }

  ngOnInit() {
    this.source.subscribe(() => this.loadFMSData()); // Get FMS data every second
  }

  /**
   * Get the current FMS data and save it in the fmsData object
   */
  loadFMSData(): void {
    this.date = new Date();
    this.fmsDataService.getData()
      .subscribe(fmsData => this.fmsData = fmsData);  // Subscribe tells what to do with the callback
  }

}
