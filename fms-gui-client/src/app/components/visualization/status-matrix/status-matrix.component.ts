import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AttributeService} from '../../../shared/services/visualization/attribute/attribute.service';
import * as d3 from 'd3';
import {Subscription} from 'rxjs';
import {CellService} from '../../../shared/services/visualization/cell/cell.service';

@Component({
  selector: 'app-status-matrix',
  templateUrl: './status-matrix.component.html',
  styleUrls: ['./status-matrix.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatusMatrixComponent implements OnInit, OnDestroy {

  private matrixId: string;
  private subscriptions: Array<Subscription>;

  constructor(private attributeService: AttributeService) {
    this.matrixId = '#status-matrix-attributes';
    this.subscriptions = []
  }

  ngOnInit(): void {
    this.subscribeToAttributeChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private subscribeToAttributeChange(): void {
    this.subscriptions.push(this.attributeService.newAttribute$.subscribe(attribute => this.addAttribute(attribute)));
  }

  private addAttribute(attribute: string): void {
    const row = d3.select(this.matrixId)
      .append('div')
      .attr('data-attribute', attribute)
      .attr('class', 'grid-cols-2 gtc-90-10 w-100');

    this.appendStatusToRow(row);
    StatusMatrixComponent.appendAttributeNameToRow(row);
  }

  private appendStatusToRow(row): void {
    const statusDiv = row.append('div')
      .attr('class', 'd-flex align-items-center p-1 w-100')
      .classed('status', true);

    const values = this.attributeService.getAllValuesForAttribute(row.attr('data-attribute'));
    statusDiv
      .selectAll('.cell')
      .data([...values])
      .enter()
      .append('div')
      .attr('class', d => `cell w-100 js-${d.timestamp}`)
      .classed('bg-success', d => d.value)
      .classed('bg-danger', d => !d.value)
      .html('&nbsp;')
      .on('mouseenter', d => CellService.hoverCellsWithTimestamp(d.timestamp))
      .on('mouseleave', d => CellService.removeHoverFromCellsWithTimestamp(d.timestamp));
  }

  private static appendAttributeNameToRow(row): void {
    row.append('div')
      .attr('class', 'd-flex align-items-center')
      .text(row.attr('data-attribute'))
      .classed('name', true);
  }
}
