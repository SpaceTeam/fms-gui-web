import {Component} from '@angular/core';
import {FmsDataService} from './shared/services/fms-data/fms-data.service';
import {CardsService} from './shared/services/cards/cards.service';
import {ControlService} from './shared/services/controls/control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FMS Client';
  opened = true;

  /**
   * The constructor containing all necessary services throughout the application
   * The services need to be created at least once
   * @param fmsDataService the FMS data service for the whole application, needs to be injected once
   * @param cardsService the Cards service for the whole application
   * @param controlService the Controls service for the whole application
   */
  constructor(fmsDataService: FmsDataService, cardsService: CardsService, controlService: ControlService) {
  }
}
