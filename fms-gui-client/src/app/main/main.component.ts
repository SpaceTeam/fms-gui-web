import { Component, OnInit } from '@angular/core';
import {FMSData} from "../shared/model/fms-data.model";
import {interval} from "rxjs";
import {FmsDataService} from "../shared/services/fms-data/fms-data.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = 'Ground Station - Space Team';

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

  /**
   * The separator between labels and texts
   */
  separator: string = ":";

  /**
   * The space between a separator and the next element
   */
  space: string = " ";

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
