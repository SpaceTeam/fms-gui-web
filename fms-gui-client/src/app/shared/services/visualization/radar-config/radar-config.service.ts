import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Point} from '../../../model/point.model';

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

  private startPosition: Point;
  private endPosition: Point;

  constructor() {
    this.resetZoomClickedSource = new Subject<void>();
    this.resetZoomClicked$ = this.resetZoomClickedSource.asObservable();

    this.startPosition = new Point(0, 0);
    this.endPosition = new Point(0, 0);

    this.rotationChangedSource = new Subject<number>();
    this.rotationChanged$ = this.rotationChangedSource.asObservable();
  }

  resetZoom(): void {
    this.resetZoomClickedSource.next();
  }

  setStartPosition(x: number, y: number): void {
    this.startPosition.x = x;
    this.startPosition.y = y;
  }

  rotateTo(x: number, y: number): void {
    // TODO: Implement me
    this.endPosition.x = x;
    this.endPosition.y = y;

    console.log(`Start: (${this.startPosition.x}, ${this.startPosition.y})`);
    console.log(`End: (${this.endPosition.x}, ${this.endPosition.y})`);

    const prevAngle = Math.atan2(this.startPosition.y, this.startPosition.x);
    const currAngle = Math.atan2(this.endPosition.y, this.endPosition.x);

    this.rotationChangedSource.next(currAngle - prevAngle);

    this.startPosition.x = this.endPosition.x;
    this.startPosition.y = this.endPosition.y;
  }
}
