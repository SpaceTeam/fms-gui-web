import {Component, OnDestroy, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-statuspanel',
  templateUrl: './statuspanel.component.html',
  styleUrls: ['./statuspanel.component.scss']
})
export class StatuspanelComponent implements OnInit, OnDestroy {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Status Panel';

  constructor(public fmsDataService: FmsDataService) {
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
  }
}
