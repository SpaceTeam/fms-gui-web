import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input()
  errorMessage: string;

  @Input()
  informationMessage: string;

  @Input()
  successMessage: string;

  @Input()
  warningMessage: string;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Closes the alert in which the 'close' event occurred
   * @param event the mouse click
   */
  close(event: MouseEvent): void {
    (<any>(event.target)).closest('.alert').classList.toggle('d-none');
  }
}
