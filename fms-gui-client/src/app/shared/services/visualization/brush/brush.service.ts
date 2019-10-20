import {Injectable} from '@angular/core';
import {FmsDataService} from '../../fms-data/fms-data.service';
import {NameValuePairUtils} from '../../../utils/NameValuePair.util';
import * as d3 from 'd3';
import {environment} from '../../../../../environments/environment';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrushService {

  private static readonly timestampPath = environment.paths.timestamp;

  // Observable string source
  private brushSource: Subject<{x0: number, x1: number}>;

  // Observable string stream
  brush$: Observable<{x0: number, x1: number}>;

  private brushRangeInterpolator;
  private brushMax: number;
  private brush;

  private svgWidth: number;
  readonly svgHeight: number;

  /**
   * The domain for the brush axis
   */
  private domain: Array<number>;

  private maxTicksAmount = 11;

  private axisGroup;
  private scale;

  private lastRange: {x0: number, x1: number};
  private lastElem;

  constructor(private fmsDataService: FmsDataService) {
    this.brushSource = new Subject<{x0: number, x1: number}>();
    this.brush$ = this.brushSource.asObservable();
    this.svgHeight = 20;

    this.lastRange = {x0: 0, x1: Infinity};
    this.lastElem = null;
  }

  initBrushIn(containerId: string): void {
    const container = d3.select(containerId);

    this.svgWidth = Number(container.style('width').slice(0, -2));

    const svg = container.append('svg')
      .attr('id', 'brush-container')
      .attr('class', 'w-100 h-100');

    this.brush = d3.brushX()
      .on('start brush', () => this.brushed())
      .on('end', (d, i, n) => this.brushEnded(d, i, n));

    // brush
    this.addGroup(svg);

    // axis
    this.addAxis(svg);

    this.update();
  }

  private addGroup(svg): void {
    svg.append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .append('g')
      .attr('id', 'brush-group')
      .call(this.brush);
  }

  private addAxis(svg): void {
    const axis = svg.append('svg')
      .attr('class', 'w-100')
      .attr('height', this.svgHeight)
      .attr('transform', `translate(0, ${this.svgHeight})`);

    this.axisGroup = axis.append('g')
      .attr('id', 'brush-axis');
  }

  update(): void {
    this.updateBrushRange();
    this.updateDomain();
    this.updateScale();
    this.updateAxis();
    this.moveBrush();
  }

  private updateBrushRange(): void {
    const data = this.fmsDataService.getAllData();
    this.brushMax = NameValuePairUtils.getValueFromTree(BrushService.timestampPath, data[data.length - 1]) as number;
    this.brushRangeInterpolator = d3.interpolateNumber(0, this.brushMax);
  }

  private updateDomain(): void {
    this.domain = [];
    const increment = 1 / this.maxTicksAmount;
    for (let i = 0; i < this.maxTicksAmount; i++) {
      this.domain[i] = Math.round(this.brushMax * (i * increment));
    }
  }

  private updateScale(): void {
    this.scale = d3.scalePoint()
      .domain(this.domain.map(i => i + ''))
      .range([0, this.svgWidth]);
  }

  private updateAxis(): void {
    this.axisGroup.call(d3.axisBottom(this.scale));
  }

  private brushed(): void {
    const selection = d3.event.selection;
    if (!d3.event.sourceEvent || !selection) {
      return;
    }
    const [x0, x1] = selection.map(d => Math.round(this.brushRangeInterpolator(d / this.svgWidth)));
    this.brushSource.next({x0: x0, x1: x1});
  }

  private brushEnded(datum, index, nodes): void {
    const selection = d3.event.selection;
    if (!d3.event.sourceEvent || !selection) {
      return;
    }
    const [x0, x1] = selection.map(d => Math.round(this.brushRangeInterpolator(d / this.svgWidth)));
    this.lastElem = nodes[index];
    this.lastRange = {x0: x0, x1: x1};

    this.moveBrush();
  }

  private moveBrush(): void {
    const x0 = this.getClosestNumberInDomainFor(this.lastRange.x0);
    const x1 = this.getClosestNumberInDomainFor(this.lastRange.x1);

    d3.select(this.lastElem)
      .transition()
      .call(this.brush.move, x1 > x0 ? [x0, x1].map(this.scale) : null);
  }

  private getClosestNumberInDomainFor(num: number): number {
    return this.domain.reduce((prev: number, curr: number) => Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
  }
}
