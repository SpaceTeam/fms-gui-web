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
  private rows: Array<string>;

  constructor(private attributeService: AttributeService, private fmsDataService: FmsDataService) {
    this.matrixId = '#status-matrix-attributes';
    this.flagsPath = 'status/flags1';
    this.subscriptions = [];
    this.rows = [];
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
    this.subscriptions.push(this.attributeService.removeAttribute$.subscribe(attribute => this.removeAttribute(attribute)));
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
    const rowId = `${StatusMatrixComponent.replaceWhitespaceWithDash(attribute)}`;
    d3.select(this.matrixId)
      .append('div')
      .attr('id', rowId)
      .attr('data-attribute', attribute)
      .attr('class', 'grid-cols-2 gtc-90-10 w-100 js-row');

    this.appendStatusToRowWithId(rowId);
    StatusMatrixComponent.appendAttributeNameToRowWithId(rowId);

    this.rows.push(rowId);
  }

  private appendStatusToRowWithId(rowId: string): void {
    d3.select(`#${rowId}`)
      .append('div')
      .attr('id', `${rowId}-status`)
      .attr('class', 'd-flex align-items-center p-1 w-100');

    this.updateRows();
  }

  private static appendAttributeNameToRowWithId(rowId: string): void {
    const row = d3.select(`#${rowId}`);

    row.append('div')
      .attr('id', `${rowId}-name`)
      .attr('class', 'd-flex align-items-center')
      .text(row.attr('data-attribute'));
  }

  private updateRows(): void {
    this.rows.forEach(rowId => this.addValuesToRowWithId(rowId));
  }

  private addValuesToRowWithId(rowId: string): void {
    const row = d3.select(`#${rowId}`);
    const attribute = row.attr('data-attribute');

    const values = this.attributeService.getAllValuesForAttribute(attribute);

    const statusRow = d3.select(`#${rowId}-status`);
    statusRow.selectAll(`.cell`)
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

  private removeAttribute(attribute: string): void {
    d3.select(`#${StatusMatrixComponent.replaceWhitespaceWithDash(attribute)}`).remove();
    this.rows = this.rows.filter(rowId => rowId !== StatusMatrixComponent.replaceWhitespaceWithDash(attribute));
  }

  private static replaceWhitespaceWithDash(str: string): string {
    return str.replace(/\s+/g, '-');
  }
}
