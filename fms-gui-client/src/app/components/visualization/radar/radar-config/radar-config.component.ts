import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RadarForm} from '../../../../shared/forms/radar.form';

@Component({
  selector: 'app-radar-config',
  templateUrl: './radar-config.component.html',
  styleUrls: ['./radar-config.component.scss']
})
export class RadarConfigComponent implements OnInit, AfterViewInit {

  /**
   * A flag for telling, if the radar configuration window is open
   */
  public isConfigOpen;

  constructor(public radarForm: RadarForm) {
    this.isConfigOpen = true;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.radarForm.initCenter();
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
