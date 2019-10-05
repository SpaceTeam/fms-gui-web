import {Component, OnDestroy, OnInit} from '@angular/core';
import {FmsDataService} from '../../shared/services/fms-data/fms-data.service';
import {NameValuePairUtils} from '../../shared/utils/NameValuePairUtils';

@Component({
  selector: 'app-status-matrix',
  templateUrl: './status-matrix.component.html',
  styleUrls: ['./status-matrix.component.scss']
})
export class StatusMatrixComponent implements OnInit, OnDestroy {

  /**
   * A list containing the search terms the user selected for display
   */
  private selectedAttributes: Array<string>;

  /**
   * A flag for telling, if the status-matrix configuration window is open
   */
  private isConfigOpen: boolean;

  /**
   * The text inside the input
   */
  private searchText: string;

  /**
   * The base path for the status flag tree
   */
  basePath = 'status/flags1';

  Utils = NameValuePairUtils;

  constructor(private fmsDataService: FmsDataService) {
    this.selectedAttributes = [];
    this.isConfigOpen = true;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  /**
   * Adds an attribute to the 'selected attributes' array
   * @param attribute the attribute to be added
   */
  private selectAttribute(attribute: string): void {
    if (this.selectedAttributes.indexOf(attribute) < 0) {
      this.selectedAttributes.push(attribute);
      (<HTMLInputElement>document.getElementById('search')).value = '';
      this.searchText = '';
    }
  }

  /**
   * Removes the given attribute from the 'selected attributes' array
   * @param attribute the attribute to be removed
   */
  private removeAttribute(attribute: string): void {
    this.selectedAttributes = this.selectedAttributes.filter(value => value !== attribute);
  }

  /**
   * Expands or collapses the configuration window in the radar component
   */
  private toggleConfiguration(): void {
    const icon = <HTMLElement>document.getElementsByClassName('toggle-icon')[0];
    this.isConfigOpen = !this.isConfigOpen;

    if (icon.innerText === 'keyboard_arrow_down') {
      icon.innerText = 'keyboard_arrow_right';
      icon.title = 'Expand radar configuration';
    } else {
      icon.innerText = 'keyboard_arrow_down';
      icon.title = 'Collapse radar configuration';
    }
  }

}
