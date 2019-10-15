import {Injectable} from '@angular/core';

import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class CellService {

  constructor() {
  }

  static hoverCellsWithTimestamp(timestamp: number): void {
    CellService.getCellsWithTimestamp(timestamp).classed('is-hovered', true);
  }

  static removeHoverFromCellsWithTimestamp(timestamp: number): void {
    CellService.getCellsWithTimestamp(timestamp).classed('is-hovered', false);
  }

  private static getCellsWithTimestamp(timestamp: number) {
    return d3.selectAll(`.js-${timestamp}`);
  }
}
