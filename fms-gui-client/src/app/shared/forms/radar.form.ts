import {FormBuilder, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {Position} from '../model/flight/position';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

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
  private centerChangedSource;

  // Observable Position stream
  centerChanged$;

  // Observable number resource
  private translationChangedSource;

  // Observable number stream
  translationChanged$;

  // Observable number resource
  private rotationChangedSource;

  // Observable number stream
  rotationChanged$;

  // Observable number resource
  private scaleChangedSource;

  // Observable number stream
  scaleChanged$;

  constructor(private fb: FormBuilder) {
    this.configurationForm = this.fb.group({
      center: this.fb.group({
        longitude: [''],
        latitude: ['']
      }),
      /*
      translation: this.fb.group({
        x: [''],
        y: ['']
      }),
       */
      rotation: [''],
      // scale: ['']
    });

    this.initCenterListener();
    // this.initTranslationListener();
    this.initRotationListener();
    // this.initScaleListener();
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

  /**
   * Published the current translation value to all subscribers of 'translationChanged$'
   */
  private initTranslationListener(): void {
    this.translationChangedSource = new Subject<{x: number, y: number}>();
    this.translationChanged$ = this.translationChangedSource.asObservable();

    const translation = this.configurationForm.get('translation');
    const xElem = translation.get('x');
    const yElem = translation.get('y');

    xElem.valueChanges.subscribe(() => this.publishTranslation());
    yElem.valueChanges.subscribe(() => this.publishTranslation());
  }

  /**
   * The actual 'publishing' method of the translation subject
   */
  private publishTranslation(): void {
    const translation = this.configurationForm.get('translation');
    this.translationChangedSource.next({x: translation.get('x').value, y: translation.get('y').value});
  }

  /**
   * Publishes the current rotation value to all subscribers of 'rotationChanged$'
   */
  private initRotationListener(): void {
    this.rotationChangedSource = new Subject<number>();
    this.rotationChanged$ = this.rotationChangedSource.asObservable();

    const rotation = this.configurationForm.get('rotation');
    rotation.valueChanges.subscribe(() => this.rotationChangedSource.next(rotation.value));
  }

  /**
   * Defines the rotation functionality whenever the radar was dragged
   * @param x the clamped x position in [-1, 1]
   * @param y the clamped y position in [-1, 1]
   */
  public dragRotation(x: number, y: number): void {
    const angle = Math.atan2(y, x);
    const angleInDeg = angle * (180 / Math.PI);

    this.rotationChangedSource.next(angleInDeg);
    this.configurationForm.get('rotation').setValue(angleInDeg);
  }

  /**
   * Publishes the current scale value to all subscribers of 'scaleChanged$'
   */
  private initScaleListener(): void {
    this.scaleChangedSource = new Subject<number>();
    this.scaleChanged$ = this.scaleChangedSource.asObservable();

    const scale = this.configurationForm.get('scale');
    scale.valueChanges.subscribe(() => this.scaleChangedSource.next(scale.value));
  }
}
