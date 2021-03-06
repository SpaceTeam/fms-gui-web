import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-status-panel',
  templateUrl: './status-panel.component.html',
  styleUrls: ['./status-panel.component.scss']
})
export class StatusPanelComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Status Panel';

  constructor(public fmsDataService: FmsDataService) {
  }

  ngOnInit() {
  }
}
