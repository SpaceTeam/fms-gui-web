import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {NameValuePair} from '../../../model/name-value-pair/name-value-pair.model';
import {NameValuePairUtils} from '../../../utils/NameValuePairUtils';
import {FmsDataService} from '../../fms-data/fms-data.service';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  flagsPath = environment.paths.flags;
  timestampPath = environment.paths.timestamp;

  // Observable string source
  private newAttributeSource: Subject<string>;

  // Observable string stream
  newAttribute$: Observable<string>;

  private removeAttributeSource: Subject<string>;
  removeAttribute$: Observable<string>;

  /**
   * A list containing the search terms the user selected for display
   */
  attributes: Array<string>;

  constructor(private fmsDataService: FmsDataService) {
    this.newAttributeSource = new Subject<string>();
    this.newAttribute$ = this.newAttributeSource.asObservable();

    this.removeAttributeSource = new Subject<string>();
    this.removeAttribute$ = this.removeAttributeSource.asObservable();

    this.attributes = [];
  }

  // Service attribute command
  newAttribute(attribute: string) {
    if (this.attributes.indexOf(attribute) < 0) {
      this.attributes.push(attribute);
      this.newAttributeSource.next(attribute);
    }
  }

  /**
   * Removes the given attribute from the 'selected attributes' array
   * @param attribute the attribute to be removed
   */
  removeAttribute(attribute: string): void {
    this.attributes = this.attributes.filter(value => value !== attribute);
    this.removeAttributeSource.next(attribute);
  }

  /**
   * Returns a copied list of selected attributes
   */
  get selectedAttributes(): Array<string> {
    return [...this.attributes];
  }

  /**
   * Returns all received values for that given attribute
   * @param attribute the attribute which values and timestamp need to be returned
   */
  getAllValuesForAttribute(attribute: string): Array<{value: boolean, timestamp: number}> {
    const allData = this.fmsDataService.getAllData();
    const values = [];

    let tree;
    let attributePair: NameValuePair;
    let timestamp: number;
    const timestamps: Array<number> = [];

    for (const dataSet of allData) {
      tree = NameValuePairUtils.getValueFromTree(this.flagsPath, dataSet);
      attributePair = NameValuePairUtils.castToArray(tree).filter(data => data.name === attribute)[0];

      timestamp = NameValuePairUtils.getValueFromTree(this.timestampPath, dataSet) as number;
      if (timestamps.indexOf(timestamp) < 0) {
        timestamps.push(timestamp);
        values.push({value: attributePair.value, timestamp: timestamp});
      }
    }

    return values;
  }

  reorderAttributes(): void {
    const attributes = [...this.attributes];
    this.attributes.forEach(attribute => this.removeAttribute(attribute));
    attributes.forEach(attribute => this.newAttribute(attribute));
  }

  clear(): void {
    this.attributes = [];
  }
}
