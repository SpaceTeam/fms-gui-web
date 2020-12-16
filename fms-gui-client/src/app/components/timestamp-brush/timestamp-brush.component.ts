import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import * as d3 from 'd3';
import {PositionService} from '../../shared/services/visualization/position/position.service';
import {Position} from '../../shared/model/flight/position';
import {BrushService} from '../../shared/services/visualization/brush/brush.service';

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

  private margin = 10;
  // TODO: The height should not be static, but change with the screen size
  private height = 40;
  private axisHeight = 0.4 * this.height;

  constructor(private positionService: PositionService, private brushService: BrushService) {
    this.timestamps = [0];
    this.scale = d3.scaleLinear();
    this.brush = d3.brushX();
  }

  ngOnInit(): void {
    this.addTimestampListener();

    // Append the SVG object to the body of the page
    this.createBrushSVG();

    this.addScale();
    this.addAxis();
    this.addBrush();
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe();
  }

  /**
   * Creates the SVG, which is added to the component, and creates the container for the brush and axis
   */
  private createBrushSVG(): void {
    d3.select(`#${this.id}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', `${this.height}`)
      .append('g')
      .attr('id', `${this.id}-g`)
      .attr('transform', `translate(${this.margin}, 0)`);
  }

  // TODO: The range should change whenever the SVG is resized
  private addScale(): void {
    this.scale = d3.scaleLinear()
      .domain([0, 0])
      .range([0, this.getComponentWidth()]);
  }

  private addAxis(): void {
    d3.select(`#${this.id}-g`)
      .append('g')
      .attr('id', `${this.id}-axis`)
      .attr('transform', `translate(0, ${this.height - this.axisHeight})`)
      .call(d3.axisBottom(this.scale));
  }

  private addBrush(): void {
    this.brush = d3.brushX()
      .extent([[0, 0], [this.getComponentWidth(), this.height - this.axisHeight - 1]]) // -1 for a gap between brush and axis
      .on('end', event => {
        this.updateBrush(event);
        this.publishSelectedRange(event);
      });

    d3.select(`#${this.id}-g`).call(this.brush);
  }

  /**
   * Updates the position of the brush as soon as something gets selected
   * For this we need the 'index' and 'nodes' param, which tells us on what element we need to perform the 'brush.move' method
   */
  private updateBrush({sourceEvent, selection}): void {
    if (!sourceEvent || !selection) {
      return;
    }
    const [x0, x1] = selection.map(d => this.findClosestTimestamp(this.scale.invert(d)));
    // TODO: Fix me!
    /*
    const elem = nodes[index];
    d3.select(elem)
      .transition()
      .call(this.brush.move, x1 > x0 ? [x0, x1].map(this.scale) : null);
     */
  }

  /**
   * Publishes the selected timestamp range to all subscribers of the BrushService
   */
  private publishSelectedRange({sourceEvent, selection}): void {
    if (!sourceEvent || !selection) {
      return;
    }
    const [x0, x1] = selection.map(d => this.findClosestTimestamp(this.scale.invert(d)));
    this.brushService.publishSelectedRange(x0, x1);
  }

  /**
   * Finds the timestamp in the 'timestamps' array which is closest to the given parameter
   * @param d the number which is used for comparing
   */
  private findClosestTimestamp(d: number): number {
    return this.timestamps.reduce((prev, curr) => (Math.abs(curr - d) < Math.abs(prev - d) ? curr : prev));
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
        // Update axis
        d3.select(`#${this.id}-axis`).call(d3.axisBottom(this.scale));
      }
    });
  }

  /**
   * Returns the width we use for the brush (not the actual svg width!)
   */
  private getComponentWidth(): number {
    const parent = d3.select(`#${this.id}`);
    return Number(parent.style('width').slice(0, -2)) - 2 * this.margin;
  }
}
