import {FormBuilder, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {Position} from '../model/flight/position';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

/**
 * A form, which handles the configuration of the radar component
 */
@Injectable({
  providedIn: 'root'
})
export class RadarForm {

  /**
   * Stores the elements for the reactive form with the configuration parameters
   */
  configurationForm: FormGroup;

  // Observable Position resource
  private centerChangedSource: Subject<Position>;

  // Observable Position stream
  centerChanged$: Observable<Position>;

  constructor(private fb: FormBuilder) {
    this.configurationForm = this.fb.group({
      center: this.fb.group({
        longitude: [''],
        latitude: ['']
      }),
      rotation: ['']
    });

    this.initCenterListener();
  }

  /**
   * Initializes the center of the radar
   */
  private initCenterListener(): void {
    this.centerChangedSource = new Subject<Position>();
    this.centerChanged$ = this.centerChangedSource.asObservable();

    const center = this.configurationForm.get('center');
    const longitudeElem = center.get('longitude');
    const latitudeElem = center.get('latitude');

    longitudeElem.valueChanges.subscribe(() => this.publishCenter());
    latitudeElem.valueChanges.subscribe(() => this.publishCenter());
  }

  /**
   * Publishes the current center position to all subscribers of 'centerChanged$'
   */
  private publishCenter(): void {
    const center = this.configurationForm.get('center');
    this.centerChangedSource.next(new Position(center.get('longitude').value, center.get('latitude').value));
  }

  /**
   * Sets the default center defined in environment.ts
   */
  initCenter(): void {
    const center = this.configurationForm.get('center');
    const longitudeElem = center.get('longitude');
    const latitudeElem = center.get('latitude');

    longitudeElem.setValue(environment.visualization.radar.position.center.longitude);
    latitudeElem.setValue(environment.visualization.radar.position.center.latitude);
  }
}
