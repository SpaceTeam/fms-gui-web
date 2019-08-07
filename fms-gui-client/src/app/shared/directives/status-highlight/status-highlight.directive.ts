import {Directive, ElementRef, Input} from '@angular/core';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';

@Directive({
  selector: '[appStatusHighlight]'
})
export class StatusHighlightDirective {

  private item: NameValuePair;

  constructor(private el: ElementRef) {
  }

  @Input('appStatusHighlight') set highlight(item: NameValuePair) {
    this.item = item;
    this.statusHighlight();
  }

  /**
   * If the value of the item changed, change the element's background for one second into the color of the badge
   */
  private statusHighlight() {
    const pair = this.item;
    if (pair !== null) {
      const elem = this.el.nativeElement;
      elem.classList.remove((pair.value) ? 'badge-danger' : 'badge-success');
      elem.classList.add((pair.value) ? 'badge-success' : 'badge-danger');
      setTimeout(function () {
        elem.classList.remove((pair.value) ? 'badge-success' : 'badge-danger');
      }, 1000);
    }
  }
}
