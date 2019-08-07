import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {NameValuePairUtils} from '../shared/utils/NameValuePairUtils';

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

  /**
   * The base path for the status flag tree
   */
  basePath = 'status/flags1';

  Utils = NameValuePairUtils;

  constructor(private fmsDataService: FmsDataService) {
  }

  ngOnInit() {
  }
}
