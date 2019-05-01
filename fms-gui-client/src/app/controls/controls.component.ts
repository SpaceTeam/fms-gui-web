import { Component, OnInit } from '@angular/core';
import {ControlService} from '../shared/services/controls/control.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  title = 'Controls';

  ControlService = ControlService;

  constructor(private controlService: ControlService) { }

  ngOnInit() {}
}
