import {Component, OnInit} from '@angular/core';
import {ControlService} from '../../shared/services/controls/control.service';
import {Control} from '../../shared/model/control.model';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  title = 'Controls';

  constructor(private controlService: ControlService) {
  }

  ngOnInit() {
  }

  /**
   * Defines what should happen, if a control button was clicked
   * @param control the control which was clicked
   */
  onControlButtonClicked(control: Control) {
    this.controlService.sendMessage(control);
  }
}
