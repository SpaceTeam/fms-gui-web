import {Component, OnDestroy, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-status-panel',
  templateUrl: './status-panel.component.html',
  styleUrls: ['./status-panel.component.scss']
})
export class StatusPanelComponent implements OnInit, OnDestroy {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Status Panel';

  FmsDataService = FmsDataService;

  constructor(public fmsDataService: FmsDataService) {
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
  }
}
