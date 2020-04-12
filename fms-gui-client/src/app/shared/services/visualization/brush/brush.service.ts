import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrushService {

  // Observable string source
  private brushSource: Subject<{x0: number, x1: number}>;

  // Observable string stream
  brush$: Observable<{x0: number, x1: number}>;

  constructor() {}

  /**
   * Publishes the selected timestamp range to all subscribers of the BrushService
   * @param x0 the start of the range
   * @param x1 the end of the range
   */
  publishSelectedRange(x0: number, x1: number): void {
    this.brushSource.next({x0: x0, x1: x1});
  }
}
