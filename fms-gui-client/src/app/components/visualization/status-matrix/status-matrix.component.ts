import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AttributeService} from '../../../shared/services/visualization/attribute/attribute.service';
import * as d3 from 'd3';
import {Subscription} from 'rxjs';
import {CellService} from '../../../shared/services/visualization/cell/cell.service';
import {FmsDataService} from '../../../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-status-matrix',
  templateUrl: './status-matrix.component.html',
  styleUrls: ['./status-matrix.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatusMatrixComponent implements OnInit, OnDestroy {

  private readonly matrixId: string;
  private readonly flagsPath: string;
  private subscriptions: Array<Subscription>;

  constructor(private attributeService: AttributeService, private fmsDataService: FmsDataService) {
    this.matrixId = '#status-matrix-attributes';
    this.flagsPath = 'status/flags1';
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscribeToAttributeChange();
    this.subscribeToFMSChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private subscribeToAttributeChange(): void {
    this.subscriptions.push(this.attributeService.newAttribute$.subscribe(attribute => this.addAttribute(attribute)));
    this.subscriptions.push(this.attributeService.removeAttribute$.subscribe(attribute => StatusMatrixComponent.removeAttribute(attribute)));
  }

  private subscribeToFMSChange(): void {
    this.subscriptions.push(
      this.fmsDataService.dataPresent$.subscribe(isPresent => {
        if (isPresent && this.fmsDataService.getValue(this.flagsPath) !== null) {
          this.updateRows();
        }
      })
    );
  }

  private addAttribute(attribute: string): void {
    const matrix = d3.select(this.matrixId);
    const row = matrix.append('div')
      .attr('data-attribute', attribute)
      .attr('class', 'grid-cols-2 gtc-90-10 w-100 js-row');

    this.appendStatusToRow(row);
    StatusMatrixComponent.appendAttributeNameToRow(row);
  }

  private appendStatusToRow(row): void {
    row.append('div')
      .attr('class', 'd-flex align-items-center p-1 w-100 js-row')
      .classed('status', true);

    this.addValuesToRow(row);
  }

  private static appendAttributeNameToRow(row): void {
    row.append('div')
      .attr('class', 'd-flex align-items-center')
      .text(row.attr('data-attribute'))
      .classed('name', true);
  }

  private updateRows(): void {
    d3.selectAll('js-row')
      .each(row => this.addValuesToRow(row));
  }

  private addValuesToRow(row): void {
    const values = this.attributeService.getAllValuesForAttribute(row.attr('data-attribute'));

    row.selectAll('.status')
      .selectAll('.cell')
      .data([...values])
      .enter()
      .append('div')
      .attr('class', d => `cell js-${d.timestamp}`)
      .classed('bg-success', d => d.value)
      .classed('bg-danger', d => !d.value)
      .html('&nbsp;')
      .on('mouseenter', d => CellService.hoverCellsWithTimestamp(d.timestamp))
      .on('mouseleave', d => CellService.removeHoverFromCellsWithTimestamp(d.timestamp));
  }

  private static removeAttribute(attribute: string): void {
    d3.select(`.js-row[data-attribute="${attribute}"]`).remove();
  }
}
