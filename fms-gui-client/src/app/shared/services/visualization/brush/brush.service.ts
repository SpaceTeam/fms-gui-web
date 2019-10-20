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

  // Observable string source
  private brushSource: Subject<{x0: number, x1: number}>;

  // Observable string stream
  brush$: Observable<{x0: number, x1: number}>;

  private readonly timestampPath: string;
  private brushRangeInterpolator;
  private brushMax: number;
  private brushWidth: number;
  private brush;

  private svgWidth: number;
  private svgHeight: number;

  private domain: Array<number>;
  private domainValues = 10;

  private axisGroup;
  private scale;
  // The width of the brush handler (e and w) -> we need it for the correct padding of the text
  private handleWidth = 3;

  constructor(private fmsDataService: FmsDataService) {
    this.brushSource = new Subject<{x0: number, x1: number}>();
    this.brush$ = this.brushSource.asObservable();
    this.brush = null;

    this.timestampPath = environment.paths.timestamp;
  }

  initBrushIn(containerId: string): void {
    const container = d3.select(containerId);

    this.svgWidth = Number(container.style('width').slice(0, -2));
    this.svgHeight = 20;

    // The gtc-90-10 factor for the width of the slider
    const gridSizeFactor = 0.9;

    const svg = container.append('svg')
      .attr('id', 'brush-container')
      .attr('width', this.svgWidth);

    this.brush = d3.brushX()
      .on('start brush', () => this.brushed())
      .on('end', (d, i, n) => this.brushended(d, i, n));

    this.brushWidth = this.svgWidth * gridSizeFactor - 2 * this.handleWidth;

    // brush
    this.addGroup(svg);

    // axis
    this.addAxis(svg);

    this.update();
  }

  private addGroup(svg): void {
    svg.append('svg')
      .attr('width', this.brushWidth)
      .attr('height', this.svgHeight)
      .attr('transform', `translate(${this.handleWidth}, 0)`)
      .append('g')
      .attr('id', 'brush-group')
      .call(this.brush);
  }

  private addAxis(svg): void {
    const axis = svg.append('svg')
      .attr('width', this.svgWidth)
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
  }

  private updateBrushRange(): void {
    const data = this.fmsDataService.getAllData();
    this.brushMax = NameValuePairUtils.getValueFromTree(this.timestampPath, data[data.length - 1]) as number;
    this.brushRangeInterpolator = d3.interpolateNumber(0, this.brushMax);
  }

  private updateDomain(): void {
    this.domain = [];
    const increment = 1 / this.domainValues;
    for (let i = 0; i <= this.domainValues; i++) {
      this.domain[i] = Math.round(this.brushMax * (i * increment));
    }
  }

  private updateScale(): void {
    this.scale = d3.scalePoint()
      .domain(this.domain.map(i => i + ''))
      .range([this.handleWidth, this.brushWidth]);
  }

  private updateAxis(): void {
    this.axisGroup.call(d3.axisBottom(this.scale));
  }

  private brushed(): void {
    const selection = d3.event.selection;
    if (selection) {
      const [x0, x1] = selection.map(d => Math.round(this.brushRangeInterpolator(d / this.brushWidth)));
      this.brushSource.next({x0: x0, x1: x1});
    }
  }

  private brushended(datum, index, nodes): void {
    const selection = d3.event.selection;
    if (!d3.event.sourceEvent || !selection) {
      return;
    }
    const [x0, x1] = selection.map(d => Math.round(this.brushRangeInterpolator(d / this.brushWidth)));
    d3.select(nodes[index])
      .transition()
      .call(this.brush.move, x1 > x0 ? [x0, x1].map(this.scale) : null);
  }
}
