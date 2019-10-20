import {Component, OnInit} from '@angular/core';
import {NameValuePairUtils} from '../../../shared/utils/NameValuePair.util';
import {NameValuePair} from '../../../shared/model/name-value-pair/name-value-pair.model';
import {Subscription} from 'rxjs';
import {FmsDataService} from '../../../shared/services/fms-data/fms-data.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-last-position-data',
  templateUrl: './last-position-data.component.html',
  styleUrls: ['./last-position-data.component.scss']
})
export class LastPositionDataComponent implements OnInit {

  /**
   * The GNSS object, containing the flight data
   */
  gnssArray: Array<Array<NameValuePair>>;

  gnss;

  timestampPath = environment.paths.timestamp;

  private fmsDataSubscription: Subscription;

  constructor(public fmsDataService: FmsDataService) {
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
        const currentGNSS = NameValuePairUtils.castToArray(this.gnss)
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
