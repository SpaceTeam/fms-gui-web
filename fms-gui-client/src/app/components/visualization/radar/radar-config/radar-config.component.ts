import {Component, OnInit} from '@angular/core';
import {RadarForm} from '../../../../shared/forms/radar.form';
import {RadarConfigService} from '../../../../shared/services/visualization/radar-config/radar-config.service';

@Component({
  selector: 'app-radar-config',
  templateUrl: './radar-config.component.html',
  styleUrls: ['./radar-config.component.scss']
})
export class RadarConfigComponent implements OnInit {

  /**
   * A flag for telling, if the radar configuration window is open
   */
  public isConfigOpen;

  constructor(public radarForm: RadarForm, private radarConfigService: RadarConfigService) {
    this.isConfigOpen = true;
  }

  ngOnInit(): void {
    this.radarForm.initCenter();
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
   * Whenever the rotation input value changes, it should modify the value in such a way, that it stays in the range of
   * [0, 360[
   * @param event the change event
   */
  bindRotationInputChangeToRange(event: Event): void {
    const input = <HTMLInputElement>event.target;
    let value = Number(input.value);
    if (!isNaN(value)) {
      while (value >= 360) {
        value -= 360;
      }
      while (value < 0) {
        value += 360;
      }
      input.value = value + '';
    }
  }
}
