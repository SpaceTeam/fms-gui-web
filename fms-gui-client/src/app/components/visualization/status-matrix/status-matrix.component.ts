import {Component, OnInit} from '@angular/core';
import {AttributeService} from '../../../shared/services/visualization/attribute/attribute.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-status-matrix',
  templateUrl: './status-matrix.component.html',
  styleUrls: ['./status-matrix.component.scss']
})
export class StatusMatrixComponent implements OnInit {

  constructor(private attributeService: AttributeService) {}

  ngOnInit(): void {
  }
}
