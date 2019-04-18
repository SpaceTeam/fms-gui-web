import { Component, OnInit } from '@angular/core';
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
   * The date object when the fms data was retrieved
   */
  date: Date;

  /**
   * The separator between labels and texts
   */
  separator = ':';

  /**
   * The space between a separator and the next element
   */
  space = ' ';

  constructor(
    private fmsDataService: FmsDataService
  ) { }

  ngOnInit() {
  }
}
