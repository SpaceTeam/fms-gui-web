import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Ground Station - Space Team';

  /**
   * The separator between labels and texts
   */
  separator = ':';

  FmsDataService = FmsDataService;

  addressForm = this.fb.group({
    host: [''],
    port: ['']
  });

  constructor(public fmsDataService: FmsDataService, private fb: FormBuilder) {
  }

  ngOnInit() {}

  onSubmit() {
    this.fmsDataService.newConnection({
      host: this.addressForm.controls['host'].value,
      port: this.addressForm.controls['port'].value
    })
  }
}
