import { Component, OnInit } from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {FMSData} from '../shared/model/fms-data/fms-data.model';
import {interval} from 'rxjs';
import {StatusControlService} from '../shared/services/controls/status-control.service';
import {StatusControl} from '../shared/model/status-control.model';

@Component({
  selector: 'app-statuspanel',
  templateUrl: './statuspanel.component.html',
  styleUrls: ['./statuspanel.component.scss']
})
export class StatuspanelComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Status Panel';

  /**
   * The FMSData object containing the current FMS data
   */
  fmsData: FMSData;

  /**
   * The controls for the status
   */
  statusControls: StatusControl[];

  /**
   * The timer, which tells how often a given function should be called
   * TODO: get the interval from a properties / yaml file
   */
  source = interval(1000);

  /**
   * The separator between labels and texts
   */
  separator = ':';

  constructor(
    private fmsDataService: FmsDataService,
    private statusControlService: StatusControlService
  ) { }

  ngOnInit() {
    this.source.subscribe(() => this.loadFMSData()); // Get FMS data every second
    this.loadStatusControls();
  }

  /**
   * Get the current FMS data and save it in the fmsData object
   */
  loadFMSData(): void {
    this.fmsDataService.getData()
      .subscribe(fmsData => this.fmsData = fmsData);  // Subscribe tells what to do with the callback
  }

  /**
   * Get the status controls
   */
  loadStatusControls(): void {
    this.statusControlService.getStatusControls()
      .subscribe(controls => this.statusControls = controls);
  }

}
