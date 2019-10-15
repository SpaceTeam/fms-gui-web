import { Component, OnInit } from '@angular/core';
import {NameValuePairUtils} from '../../../shared/utils/NameValuePairUtils';
import {FmsDataService} from '../../../shared/services/fms-data/fms-data.service';

@Component({
  selector: 'app-flags',
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss']
})
export class FlagsComponent implements OnInit {

  /**
   * The base path for the status flag tree
   */
  basePath = 'status/flags1';

  Utils = NameValuePairUtils;

  constructor(private fmsDataService: FmsDataService) {
  }

  ngOnInit(): void {
  }
}