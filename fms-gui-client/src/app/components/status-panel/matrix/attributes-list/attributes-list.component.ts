import {Component, OnInit} from '@angular/core';
import {AttributeService} from '../../../../shared/services/visualization/attribute/attribute.service';

@Component({
  selector: 'app-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.scss']
})
export class AttributesListComponent implements OnInit {

  constructor(private attributeService: AttributeService) {
  }

  ngOnInit() {
  }
}
