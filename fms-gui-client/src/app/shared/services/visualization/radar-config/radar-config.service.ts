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

  // Observable number resource
  private longitudeChangedSource: Subject<number>;

  // Observable number stream
  longitudeChanged$: Observable<number>;

  // Observable number resource
  private latitudeChangedSource: Subject<number>;

  // Observable number stream
  latitudeChanged$: Observable<number>;

  // Observable number (in radians) resource
  private rotationChangedSource: Subject<number>;

  // Observable number stream
  rotationChanged$: Observable<number>;

  constructor() {
    this.resetZoomClickedSource = new Subject<void>();
    this.resetZoomClicked$ = this.resetZoomClickedSource.asObservable();

    this.rotationChangedSource = new Subject<number>();
    this.rotationChanged$ = this.rotationChangedSource.asObservable();

    this.longitudeChangedSource = new Subject<number>();
    this.longitudeChanged$ = this.longitudeChangedSource.asObservable();

    this.latitudeChangedSource = new Subject<number>();
    this.latitudeChanged$ = this.latitudeChangedSource.asObservable();
  }

  resetZoom(): void {
    this.resetZoomClickedSource.next();
  }

  /**
   * Publishes a new longitude value to all subscribers of the longitude observable
   */
  publishNewLongitude(longitude: number): void {
    this.longitudeChangedSource.next(longitude);
  }

  /**
   * Publishes a new latitude value to all subscribers of the latitude observable
   */
  publishNewLatitude(latitude: number): void {
    this.latitudeChangedSource.next(latitude);
  }

  /**
   * Publishes a new rotation value to all subscribers of the rotation observable
   */
  publishNewRotation(angleInRadians: number): void {
    this.rotationChangedSource.next(angleInRadians);
  }
}
