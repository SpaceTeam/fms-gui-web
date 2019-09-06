import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Position} from '../../../model/flight/position';
import {FmsDataService} from '../../fms-data/fms-data.service';

/**
 * A service, that enables to communicate between components, which share a position
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  // Observable Position resource
  private positionAnnounceSource;

  // Observable Position stream
  positionAnnounced$;

  constructor(private fmsDataService: FmsDataService) {
    this.positionAnnounceSource = new Subject<Position>();
    this.positionAnnounced$ = this.positionAnnounceSource.asObservable();

    // Whenever we have new data, we publish a new position
    fmsDataService.dataPresent$.subscribe(isPresent => {
      if (isPresent && fmsDataService.getValue('GNSS') !== null) {
        this.announcePosition(this.createNewPosition())
      }
    });

    // TODO: Subscribe to FMS' error subject, so that you notify the radar component to clear the positions
  }

  // Message command
  announcePosition(position: Position) {
    this.positionAnnounceSource.next(position);
  }

  /**
   * Creates a new 'Position' object of the FMS' current position
   * @return the current position of the FMS as a 'Position' object
   */
  private createNewPosition(): Position {
    let longitude: number = <number>this.fmsDataService.getValue('GNSS/longitude');
    let latitude: number = <number>this.fmsDataService.getValue('GNSS/latitude');
    let altitude: number = <number>this.fmsDataService.getValue('GNSS/altitude');
    let timestamp: number = <number>this.fmsDataService.getValue('Status/FMSTimestamp');
    return <Position>{longitude, latitude, altitude, timestamp};
  }
}
