import {Component, OnDestroy, OnInit} from '@angular/core';
import {RadarConfigService} from '../../../../shared/services/visualization/radar-config/radar-config.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RadarUtil} from '../../../../shared/utils/visualization/radar/radar.util';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-radar-config',
  templateUrl: './radar-config.component.html',
  styleUrls: ['./radar-config.component.scss']
})
export class RadarConfigComponent implements OnInit, OnDestroy {

  /**
   * A flag for telling, if the radar configuration window is open
   */
  public isConfigOpen;

  /**
   * Stores the elements for the reactive form with the configuration parameters
   */
  configurationForm: FormGroup;

  private readonly subscriptions: Array<Subscription>;

  constructor(private fb: FormBuilder, private radarConfigService: RadarConfigService) {
    this.isConfigOpen = true;
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.configurationForm = this.fb.group({
      center: this.fb.group({
        longitude: [''],
        latitude: ['']
      }),
      rotation: ['']
    });

    // Longitude and latitude
    this.initCenter();
    this.addCenterInputListener();
    this.addCenterListener();

    // Rotation
    this.initRotation();
    this.addRotationInputListener();
    this.addRotationListener();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Expands or collapses the configuration window in the radar component
   * TODO: This should let the parent also know to resize the space used for the config -> use more screen space
   */
  toggleConfiguration(): void {
    const icon = <HTMLElement>document.getElementById('toggle-icon');
    this.isConfigOpen = !this.isConfigOpen;

    const visualizationName = 'radar';

    if (icon.innerText === 'keyboard_arrow_down') {
      icon.innerText = 'keyboard_arrow_right';
      icon.title = `Expand ${visualizationName} configuration`;
    } else {
      icon.innerText = 'keyboard_arrow_down';
      icon.title = `Collapse ${visualizationName} configuration`;
    }
  }

  /**
   * Lets the radar know, that the 'Reset zoom' button got clicked
   */
  resetZoom(): void {
    this.radarConfigService.resetZoom();
  }

  /**
   * Initializes the center inputs with the default values declared in the environment file
   * @private
   */
  private initCenter() {
    const center = this.configurationForm.get('center');
    const longitude = center.get('longitude');
    const latitude = center.get('latitude');

    longitude.setValue(environment.visualization.radar.position.center.longitude);
    latitude.setValue(environment.visualization.radar.position.center.latitude);
  }

  /**
   * Listens to any input changes inside the longitude and latitude inputs and updates all other components
   * @private
   */
  private addCenterInputListener() {
    const center = this.configurationForm.get('center');
    const longitude = center.get('longitude');
    const latitude = center.get('latitude');

    longitude.valueChanges.subscribe(lon => this.radarConfigService.publishNewLongitude(lon));
    latitude.valueChanges.subscribe(lat => this.radarConfigService.publishNewLatitude(lat));
  }

  /**
   * Whenever we receive a new longitude or latitude value from the two observables, we need to update the inputs
   * @private
   */
  private addCenterListener() {
    const longitudeSubscription = this.radarConfigService.longitudeChanged$
      .subscribe(longitude => this.updateInput('center.longitude', longitude));
    const latitudeSubscription = this.radarConfigService.latitudeChanged$
      .subscribe(latitude => this.updateInput('center.latitude', latitude));
    this.subscriptions.push(longitudeSubscription, latitudeSubscription);
  }

  /**
   * Initializes the rotation input with the default value of 0
   * @private
   */
  private initRotation(): void {
    const rotation = this.configurationForm.get('rotation');
    rotation.setValue(0);
  }

  /**
   * Listens to any input changes inside the rotation input and updates all other components
   * @private
   */
  private addRotationInputListener(): void {
    const rotation = this.configurationForm.get('rotation');
    rotation.valueChanges.subscribe(angleInDegrees => this.radarConfigService.publishNewRotation(RadarUtil.toRadians(angleInDegrees)));
  }

  /**
   * Whenever we receive a new rotation value from the rotation observable, we need to update the rotation input
   * @private
   */
  private addRotationListener(): void {
    const rotationSubscription = this.radarConfigService.rotationChanged$
      .subscribe(angleInRadians => this.updateInput('rotation', RadarUtil.toDegrees(angleInRadians)));
    this.subscriptions.push(rotationSubscription);
  }

  /**
   * Updates the value inside the rotation input
   */
  private updateInput(path: string, value: number): void {
    const input = this.configurationForm.get(path);

    // We need 'emitEvent: false' so that we don't end up in an endless loop when updating angle inside the input
    input.patchValue(value, {emitEvent: false});
  }
}
