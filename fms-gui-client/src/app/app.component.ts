import { Component } from '@angular/core';
import {FmsDataService} from './shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FMS Client';
  opened: boolean = true;

  /**
   * The constructor containing all necessary services, which also need to be opened at least once
   * @param fmsDataService the FMS data service for the whole application, needs to be injected once
   */
  constructor(fmsDataService: FmsDataService) {
  }
}
