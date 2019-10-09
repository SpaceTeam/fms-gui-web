import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AlertTypeEnum} from '../../shared/enums/alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnChanges {

  @Input()
  activeAlert: AlertTypeEnum;

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
    AlertComponent.hideAllAlerts();
    AlertComponent.showCurrentActiveAlert(this.activeAlert);
  }

  ngOnChanges(changes: SimpleChanges): void {
    AlertComponent.hideAllAlerts();
    // We first need to check, if the current active value type changed or not and then we can use the current active type
    AlertComponent.showCurrentActiveAlert((changes.activeAlert) ? changes.activeAlert.currentValue : this.activeAlert);
  }

  /**
   * Shows the alert with the given type
   * @param activeAlert the current alert type
   */
  private static showCurrentActiveAlert(activeAlert: AlertTypeEnum) {
    document.querySelectorAll('.alert').item(activeAlert).classList.remove('d-none');
  }

  /**
   * Hides all alerts
   */
  private static hideAllAlerts(): void {
    document.querySelectorAll(".alert").forEach(alert => alert.classList.add('d-none'));
  }

  /**
   * Closes the alert in which the 'close' event occurred
   * @param event the mouse click
   */
  close(event: MouseEvent): void {
    (<any>(event.target)).closest('.alert').classList.toggle('d-none');
  }
}
