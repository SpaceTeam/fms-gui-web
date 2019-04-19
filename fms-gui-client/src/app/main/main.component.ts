import {Component, OnDestroy, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Ground Station - Space Team';

  /**
   * The separator between labels and texts
   */
  separator = ':';

  /**
   * The space between a separator and the next element
   */
  space = ' ';

  constructor(public fmsDataService: FmsDataService) {
  }

  ngOnInit() {}
}
