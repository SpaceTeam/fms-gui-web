import {Component, OnDestroy, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {NameValuePairUtils} from '../shared/utils/NameValuePairUtils';
import {NameValuePair} from '../shared/model/name-value-pair/name-value-pair.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-flight-mode',
  templateUrl: './flight-mode.component.html',
  styleUrls: ['./flight-mode.component.scss']
})
export class FlightModeComponent implements OnInit, OnDestroy {

  /**
   * The component's title, which will be used in the toolbar
   */
  private title = 'Flight mode';

  /**
   * The GNSS object, containing the flight data
   */
  gnssArray: Array<Array<NameValuePair>>;

  gnss;

  private fmsDataSubscription: Subscription;

  constructor(private fmsDataService: FmsDataService) {
    // Initialize the local objects
    this.gnssArray = [];
    this.gnss = null;

    this.addFMSDataListener();
  }

  ngOnInit() {
  }

  // TODO: Maybe create a gnssPresent Subject?
  private addFMSDataListener(): void {
    // Wait for the FMS data to be present
    this.fmsDataSubscription = this.fmsDataService.dataPresent$.subscribe(isPresent => {

      this.gnss = this.fmsDataService.getValue('GNSS');
      if (isPresent && this.gnss !== null) {
        // Save the current GNSS object in the local GNSS object
        let currentGNSS = NameValuePairUtils.castToArray(this.gnss)
          .filter(val => val.name !== 'GetLastMessage');

        // We unshift the array, since we want the current GNSS data to be the first in the array
        this.gnssArray.unshift(currentGNSS);
      }
    });
  }

  ngOnDestroy() {
    // prevent memory leak when the component is destroyed
    this.fmsDataSubscription.unsubscribe();
  }
}
