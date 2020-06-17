import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

/**
 * This service manages the communication between the radar and its config
 * It is only provided in the component where it is used (e.g. flight-position) to ensure, that the communication
 * happens only between one radar/config pair -> the change in one radar should not affect another radar
 */
@Injectable()
export class RadarConfigService {

  // Observable Position resource
  private resetZoomClickedSource: Subject<void>;

  // Observable Position stream
  resetZoomClicked$: Observable<void>;

  constructor() {
    this.resetZoomClickedSource = new Subject<void>();
    this.resetZoomClicked$ = this.resetZoomClickedSource.asObservable();
  }

  resetZoom() {
    this.resetZoomClickedSource.next();
  }
}
