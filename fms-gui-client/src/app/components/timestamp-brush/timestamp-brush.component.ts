import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {Position} from '../../shared/model/flight/position';

@Component({
  selector: 'app-timestamp-brush',
  templateUrl: './timestamp-brush.component.html',
  styleUrls: ['./timestamp-brush.component.scss']
})
export class TimestampBrushComponent implements OnInit, OnDestroy {

  @Input()
  private id: string;

  private positionSubscription: Subscription;
  private timestamps: Array<number>;
  private brush: d3.BrushBehavior<any>;
  private scale: d3.ScaleLinear<number, number>;
  private axis: d3.Axis<any>;

  private margin = 10;

  constructor(private positionService: PositionService) {
    this.timestamps = [];
    this.scale = d3.scaleLinear();
  }

  ngOnInit(): void {
    this.createBrushSVG();
    this.createBrush();

    this.adjustBrushScale();
    this.createAxis();

    this.addTimestampListener();
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe();
  }

  /**
   * Creates the interactive brush SVG
   */
  private createBrushSVG(): void {
    const parent = d3.select(`#${this.id}`);

    const width = Number(parent.style('width').slice(0, -2));

    // TODO: The height should not be static, but change with the screen size
    parent.append('svg')
      .attr('id', `${this.id}-svg`)
      .classed('brush', true)
      .attr('width', `${width -  2 * this.margin}px`)
      .attr('height', '30px')
      .style('margin-left', `${this.margin}px`);
  }

  /**
   * Creates the 2D brush with the timestamps on the 'x' axis
   */
  private createBrush(): void {
    const brushSvg = d3.select(`#${this.id}-svg`);

    // Determine the width and height of the SVG, which we need for the brush extent
    const width = Number(brushSvg.style('width').slice(0, -2));
    const height = Number(brushSvg.style('height').slice(0, -2));

    this.brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('start end', () => this.updateChart());

    brushSvg.call(this.brush);
  }

  private updateChart(): void {
    // Get the selection coordinates
    const selection = d3.event.selection;
    if (!d3.event.sourceEvent || !selection) {
      return;
    }

    // TODO: Whenever the user selects a given interval, notify the component what interval was changed
  }

  private adjustBrushScale() {
    const parent = d3.select(`#${this.id}`);
    const parentWidth = Number(parent.style('width').slice(0, -2));

    // TODO: The range should change whenever the SVG is resized
    this.scale
      .range([this.margin, parentWidth - this.margin]) // in px
      .domain([0, 1]);
  }

  /**
   * Creates a new SVG and adds the axis to it
   */
  private createAxis() {
    this.axis = d3.axisBottom(this.scale);

    // TODO: The height should not be in px, but rather dynamic
    d3.select(`#${this.id}`)
      .append('svg')
      .attr('id', `${this.id}-axis`)
      .attr('width', '100%')
      .attr('height', '20px')
      .append('g')
      .call(this.axis);
  }

  /**
   * Adds a listener for detecting timestamp changes
   * We need this to trigger the change of the brush's domain
   */
  private addTimestampListener(): void {
    this.positionSubscription = this.positionService.positionAnnounced$.subscribe((position: Position) => {
      if (!this.timestamps.includes(position.timestamp)) {
        this.timestamps.push(position.timestamp);
        this.scale.domain([0, position.timestamp]);
      }
    });
  }
}
