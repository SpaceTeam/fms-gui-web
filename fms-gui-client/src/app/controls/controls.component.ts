import { Component, OnInit } from '@angular/core';
import {interval} from 'rxjs';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {ControlService} from '../shared/services/controls/control.service';
import {FMSData} from '../shared/model/fms-data/fms-data.model';
import {Control} from '../shared/model/control.model';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  title = 'Controls';

  /**
   * The FMSData object containing the current FMS data
   */
  fmsData: FMSData;

  /**
   * The controls for the status
   */
  controls: Control[];

  constructor(private fmsDataService: FmsDataService,
              private controlService: ControlService) { }

  /**
   * The timer, which tells how often a given function should be called
   * TODO: get the interval from a properties / yaml file
   */
  source = interval(1000);

  ngOnInit() {
    this.source.subscribe(() => this.loadFMSData()); // Get FMS data every second
    this.loadControls();
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
  loadControls(): void {
    this.controlService.getControls()
      .subscribe(controls => this.controls = controls);
  }

}
