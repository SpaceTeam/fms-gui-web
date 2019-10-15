import {Component, OnDestroy, OnInit} from '@angular/core';
import {NameValuePairUtils} from '../../../shared/utils/NameValuePairUtils';
import {FmsDataService} from '../../../shared/services/fms-data/fms-data.service';
import {AttributeService} from '../../../shared/services/visualization/attribute/attribute.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit, OnDestroy {

  /**
   * A flag for telling, if the status-matrix configuration window is open
   */
  private isConfigOpen: boolean;

  /**
   * The text inside the input
   */
  private searchText: string;

  private flagsPath = environment.paths.flags;

  Utils = NameValuePairUtils;

  constructor(private fmsDataService: FmsDataService, private attributeService: AttributeService) {
    this.isConfigOpen = true;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.attributeService.clear();
  }

  /**
   * Adds an attribute to the 'selected attributes' array
   * @param attribute the attribute to be added
   */
  private selectAttribute(attribute: string): void {
    this.attributeService.newAttribute(attribute);
    (<HTMLInputElement>document.getElementById('search')).value = '';
    this.searchText = '';
  }

  /**
   * Expands or collapses the configuration window in the radar component
   */
  private toggleConfiguration(): void {
    const icon = <HTMLElement>document.getElementById('toggle-icon');
    this.isConfigOpen = !this.isConfigOpen;

    const visualizationName = 'status matrix';

    if (icon.innerText === 'keyboard_arrow_down') {
      icon.innerText = 'keyboard_arrow_right';
      icon.title = `Expand ${visualizationName} configuration`;
    } else {
      icon.innerText = 'keyboard_arrow_down';
      icon.title = `Collapse ${visualizationName} configuration`;
    }
  }

}
