import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Position} from '../../../model/flight/position';

@Injectable({
  providedIn: 'root'
})
export class FlightConfigService {

  // Observable Position resource
  private centerAnnounceSource: Subject<Position>;

  // Observable Position stream
  centerAnnounced$: Observable<Position>;

  // Observable Position resource
  private rotationAnnounceSource: Subject<number>;

  // Observable Position stream
  rotationAnnounced$: Observable<number>;

  constructor() {
    this.centerAnnounceSource = new Subject<Position>();
    this.centerAnnounced$ = this.centerAnnounceSource.asObservable();
    this.rotationAnnounceSource = new Subject<number>();
    this.rotationAnnounced$ = this.rotationAnnounceSource.asObservable();
  }

  publishNewCenter(position: Position): void {
    this.centerAnnounceSource.next(position);
  }

  publishNewRotation(rotation: number): void {
    this.rotationAnnounceSource.next(rotation);
  }
}
