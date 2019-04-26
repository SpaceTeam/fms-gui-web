import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';

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

  FmsDataService = FmsDataService;

  constructor(public fmsDataService: FmsDataService) {
  }

  ngOnInit() {}
}
