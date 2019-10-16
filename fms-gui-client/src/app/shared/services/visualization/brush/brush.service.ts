import {Injectable} from '@angular/core';
import {FmsDataService} from '../../fms-data/fms-data.service';
import {NameValuePairUtils} from '../../../utils/NameValuePairUtils';
import * as d3 from 'd3';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrushService {

  private readonly timestampPath: string;
  private brushRangeInterpolator;
  private svgWidth: number;

  constructor(private fmsDataService: FmsDataService) {
    this.timestampPath = environment.paths.timestamp;
    this.subscribeToFMSChange();
  }

  private subscribeToFMSChange(): void {
    this.fmsDataService.dataPresent$.subscribe(isPresent => {
      if (isPresent) {
        this.updateBrushRange();
      }
    });
  }

  private updateBrushRange(): void {
    const data = this.fmsDataService.getAllData();
    const end = NameValuePairUtils.getValueFromTree(this.timestampPath, data[data.length - 1]) as number;

    this.brushRangeInterpolator = d3.interpolateNumber(0, end);
  }

  initBrushIn(containerId: string): void {
    const container = d3.select(containerId);
    container.attr('class', 'brush-container');

    this.svgWidth = Number(container.style('width').slice(0, -2));
    const height = 20;

    const svg = container.append('svg')
      .attr('width', this.svgWidth)
      .attr('height', height)
      .attr('viewbox', `[0, 0, ${this.svgWidth}, ${height}]`);

    const brush = d3.brushX().on('start brush end', () => this.brushed());

    // brush
    svg.append('g')
      .attr('id', 'brush-group')
      .call(brush);
  }

  private brushed(): void {
    const selection = d3.event.selection;
    if (selection) {
      let [x0, x1] = selection;
      x0 = this.brushRangeInterpolator(x0 / this.svgWidth);
      x1 = this.brushRangeInterpolator(x1 / this.svgWidth);
      console.log(`[x0, x1]: [${x0}, ${x1}]`);
    }
  }
}
