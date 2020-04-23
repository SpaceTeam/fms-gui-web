import { Component, OnInit } from '@angular/core';
import {RadarForm} from '../../../../shared/forms/radar.form';

// TODO: Create a RadarService, which handles the interaction between the config, brush and radar
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

  constructor(public radarForm: RadarForm) {
    this.isConfigOpen = true;
  }

  ngOnInit(): void {
  }

  /**
   * Expands or collapses the configuration window in the radar component
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

  resetZoom(): void {
    // TODO: Implement me
  }
}
