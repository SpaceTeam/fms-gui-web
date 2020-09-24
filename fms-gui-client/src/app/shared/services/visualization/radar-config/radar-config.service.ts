import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Point} from '../../../model/point.model';
import {RadarUtil} from "../../../utils/visualization/radar/radar.util";

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

  rotateTo(x: number, y: number): void {
    const point = RadarUtil.toCartesian(new Point(x, y), new Point(50, 50));
    // We need two pi, so that the angle is always positive
    const twoPi = 2 * Math.PI;
    this.rotationChangedSource.next(Math.atan2(point.y, point.x) + twoPi);
  }
}
