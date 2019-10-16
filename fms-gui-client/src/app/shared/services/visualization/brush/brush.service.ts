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

  private readonly domain: Array<number>;
  private domainValues = 10;

  constructor(private fmsDataService: FmsDataService) {
    this.brushSource = new Subject<{x0: number, x1: number}>();
    this.brush$ = this.brushSource.asObservable();
    this.domain = [];

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
    this.brushMax = NameValuePairUtils.getValueFromTree(this.timestampPath, data[data.length - 1]) as number;

    this.brushRangeInterpolator = d3.interpolateNumber(0, this.brushMax);
  }

  initBrushIn(containerId: string): void {
    const container = d3.select(containerId);

    this.svgWidth = Number(container.style('width').slice(0, -2));
    this.svgHeight = 20;

    // The width of the brush handler (e and w) -> we need it for the correct padding of the text
    const handleWidth = 3;

    // The gtc-90-10 factor for the width of the slider
    const gridSizeFactor = 0.9;

    const svg = container.append('svg')
      .attr('width', this.svgWidth);
    const brush = d3.brushX().on('start brush end', () => this.brushed());

    this.brushWidth = this.svgWidth * gridSizeFactor - 2 * handleWidth;

    // brush
    svg.append('svg')
      .attr('width', this.brushWidth)
      .attr('height', this.svgHeight)
      .attr('transform', `translate(${handleWidth}, 0)`)
      .append('g')
      .attr('id', 'brush-group')
      .call(brush);

    const increment = 1 / this.domainValues;
    for (let i = 0; i <= this.domainValues; i++) {
      this.domain[i] = Math.round(this.brushMax * (i * increment));
    }

    const scale = d3.scalePoint()
      .domain(this.domain.map(i => i + ''))
      .range([handleWidth, this.brushWidth]);

    // axis
    svg.append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('transform', `translate(0, ${this.svgHeight})`)
      .append('g')
      .attr('id', 'brush-axis')
      .call(d3.axisBottom(scale));
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
