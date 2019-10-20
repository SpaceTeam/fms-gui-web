import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-flight-mode',
  templateUrl: './flight-mode.component.html',
  styleUrls: ['./flight-mode.component.scss']
})
export class FlightModeComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Flight mode';

  constructor(private fmsDataService: FmsDataService) {}

  ngOnInit() {}
}
