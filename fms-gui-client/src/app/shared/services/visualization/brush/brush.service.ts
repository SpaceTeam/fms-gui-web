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

    this.timestampPath = environment.paths.timestamp;
  }

  initBrushIn(containerId: string): void {
    const container = d3.select(containerId);

    this.svgWidth = Number(container.style('width').slice(0, -2));
    this.svgHeight = 20;

    // The gtc-90-10 factor for the width of the slider
    const gridSizeFactor = 0.9;

    const svg = container.append('svg').attr('width', this.svgWidth);
    const brush = d3.brushX().on('start brush end', () => this.brushed());

    this.brushWidth = this.svgWidth * gridSizeFactor - 2 * this.handleWidth;

    // brush
    svg.append('svg')
      .attr('width', this.brushWidth)
      .attr('height', this.svgHeight)
      .attr('transform', `translate(${this.handleWidth}, 0)`)
      .append('g')
      .attr('id', 'brush-group')
      .call(brush);

    // axis
    const axis = svg.append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('transform', `translate(0, ${this.svgHeight})`);

    this.axisGroup = axis.append('g').attr('id', 'brush-axis');

    this.update();
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
      let [x0, x1] = selection;
      x0 = this.brushRangeInterpolator(x0 / this.brushWidth);
      x1 = this.brushRangeInterpolator(x1 / this.brushWidth);
      this.brushSource.next({x0: x0, x1: x1});
    }
  }
}
