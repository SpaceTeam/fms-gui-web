import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Point} from '../../../model/point.model';
import {RadarUtil} from '../../../utils/visualization/radar/radar.util';

/**
 * This service manages the communication between the radar and its config
 */
@Injectable({
  providedIn: 'root'
})
export class RadarConfigService {

  // Observable zoom resource
  private resetZoomClickedSource: Subject<void>;

  // Observable zoom stream
  resetZoomClicked$: Observable<void>;

  // Observable number (in radians) resource
  private rotationChangedSource: Subject<number>;

  // Observable number stream
  rotationChanged$: Observable<number>;

  constructor() {
    this.resetZoomClickedSource = new Subject<void>();
    this.resetZoomClicked$ = this.resetZoomClickedSource.asObservable();

    this.rotationChangedSource = new Subject<number>();
    this.rotationChanged$ = this.rotationChangedSource.asObservable();
  }

  resetZoom(): void {
    this.resetZoomClickedSource.next();
  }

  /**
   * Publishes a new rotation value to all subscribers of the rotation observable
   */
  publishNewRotation(angleInRadians: number): void {
    this.rotationChangedSource.next(angleInRadians);
  }
}
