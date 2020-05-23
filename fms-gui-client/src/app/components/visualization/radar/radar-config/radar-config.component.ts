import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RadarForm} from '../../../../shared/forms/radar.form';

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

  @Output()
  public resetZoomClicked: EventEmitter<void>;

  constructor(public radarForm: RadarForm) {
    this.isConfigOpen = true;
    this.resetZoomClicked = new EventEmitter<void>();
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
   * Lets the parent know, that the 'Reset zoom' button got clicked
   */
  resetZoom(): void {
    this.resetZoomClicked.emit();
  }
}
