import {Injectable} from '@angular/core';
import {FmsDataService} from '../../fms-data/fms-data.service';
import {NameValuePairUtils} from '../../../utils/NameValuePair.util';
import * as d3 from 'd3';
import {environment} from '../../../../../environments/environment';
import {Observable, Subject, Subscription} from 'rxjs';
import {PositionService} from '../position/position.service';
import {Position} from '../../../model/flight/position';

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

  private axisGroup;
  private scale;

  private lastRange: {x0: number, x1: number};
  private lastElem;

  constructor(private fmsDataService: FmsDataService) {
    this.brushSource = new Subject<{x0: number, x1: number}>();
    this.brush$ = this.brushSource.asObservable();

    this.svgHeight = 20;
    this.svgWidth = 1;

    this.lastRange = {x0: 0, x1: Infinity};
    this.lastElem = null;
  }

  appendBrush(): void {
    d3.select('#brush').append('svg')
      .attr('id', 'brush-svg')
      .attr('class', 'w-100 h-100');

    this.initBrush();

    this.updateContainerSize();
    this.updateAxisAndBrushGroup();
  }

  private initBrush(): void {
    this.brush = d3.brushX()
      .on('start brush', () => this.brushed())
      .on('end', (d, i, n) => this.brushEnded(d, i, n));
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

  private updateContainerSize(): void {
    const container = d3.select('#brush');
    this.svgWidth = Number(container.style('width').slice(0, -2));
  }

  private updateAxisAndBrushGroup(): void {
    const svg = d3.select('#brush-svg')
      .attr('class', 'brush-container');
    this.removeAllChildren(<HTMLElement>svg.node());

    // brush
    this.addGroup(svg);

    // axis
    this.addAxis(svg);

    this.update();
  }

  private addGroup(svg): void {
    svg.append('svg')
      .attr('class', 'w-100')
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
    this.updateScale();
    this.updateAxis();
    this.moveBrush();
  }

  private updateBrushRange(): void {
    const data = this.fmsDataService.getAllData();
    this.brushMax = NameValuePairUtils.getValueFromTree(BrushService.timestampPath, data[data.length - 1]) as number;
    this.brushRangeInterpolator = d3.interpolateNumber(0, this.brushMax);
  }

  private updateScale(): void {
    this.scale = d3.scaleLinear()
      .domain([0, this.brushMax])
      .range([0, this.svgWidth]);
  }

  private updateAxis(): void {
    this.axisGroup.call(d3.axisBottom(this.scale));
  }

  private moveBrush(): void {
    const x0 = Math.round(this.lastRange.x0);
    const x1 = Math.round(this.lastRange.x1);

    d3.select(this.lastElem)
      .transition()
      .call(this.brush.move, x0 < x1 ? [x0, x1].map(this.scale) : null);
  }

  // TODO: Move me to a DOM helper class
  removeAllChildren(elem: HTMLElement): void {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }
}
