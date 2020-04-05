import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-flight-position',
  templateUrl: './flight-position.component.html',
  styleUrls: ['./flight-position.component.scss']
})
export class FlightPositionComponent implements OnInit {

  private static BRUSH_ID = 'flight-position-brush';

  constructor() { }

  ngOnInit(): void {
    this.createBrushSVG();
  }

  // TODO: As soon as this is done, remove content from the brush service and move this code to the service
  private createBrushSVG(): void {
    const brushSvg = d3.select(`#${FlightPositionComponent.BRUSH_ID}`)
      .append('svg')
      .attr('id', `${FlightPositionComponent.BRUSH_ID}-svg`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Determine the width and height of the SVG, which we need for the brush extent
    const width = Number(brushSvg.style('width').slice(0, -2));
    const height = Number(brushSvg.style('height').slice(0, -2));

    brushSvg.call(d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('start end', () => this.updateChart())
    );
  }

  private updateChart(): void {
    // Get the selection coordinates
    const extent = d3.event.selection;
  }
}
