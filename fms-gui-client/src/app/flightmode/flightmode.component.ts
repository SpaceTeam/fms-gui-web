import { Component, OnInit } from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-flightmode',
  templateUrl: './flightmode.component.html',
  styleUrls: ['./flightmode.component.scss']
})
export class FlightmodeComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Flight mode';

  constructor(private fmsDataService: FmsDataService) { }

  ngOnInit() { }
}
