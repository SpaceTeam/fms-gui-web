import {Component, OnDestroy, OnInit} from '@angular/core';
import {RadarConfigService} from '../../../../shared/services/visualization/radar-config/radar-config.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RadarUtil} from '../../../../shared/utils/visualization/radar/radar.util';
import {Subscription} from 'rxjs';

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
    const rotationSubscription = this.radarConfigService.rotationChanged$.subscribe(angleInRadians => this.rotate(angleInRadians));
    this.subscriptions.push(rotationSubscription);
  }

  /**
   * Updates the value inside the rotation input
   */
  private rotate(angleInRadians: number): void {
    const rotation = this.configurationForm.get('rotation');

    // We need 'emitEvent: false' so that we don't end up in an endless loop when updating angle inside the input
    rotation.patchValue(RadarUtil.toDegrees(angleInRadians), {emitEvent: false});
  }
}
