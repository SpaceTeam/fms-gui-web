import { Component, OnInit } from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {ControlService} from '../shared/services/controls/control.service';
import {Control} from '../shared/model/control.model';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  title = 'Controls';

  /**
   * The controls for the status
   */
  controls: Control[];

  constructor(private fmsDataService: FmsDataService,
              private controlService: ControlService) { }

  ngOnInit() {
    this.loadControls();
  }

  /**
   * Get the status controls
   */
  loadControls(): void {
    this.controlService.getControls()
      .subscribe(controls => this.controls = controls);
  }

}
