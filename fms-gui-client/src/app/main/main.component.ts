import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {FormBuilder, Validators} from '@angular/forms';
import {WebSocketUtil} from '../shared/utils/web-socket/web-socket.util';

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

  errorMessage = 'You must enter a value';

  alertErrorMessage: string;
  alertSuccessMessage: string;

  addressForm = this.fb.group({
    host: ['', [Validators.required]],
    port: ['', [Validators.required]],
    path: ['']
  });

  constructor(private fb: FormBuilder, private fmsDataService: FmsDataService) {
  }

  ngOnInit() {
    this.setMessages('No connection');
  }

  onSubmit() {
    WebSocketUtil.newConnection({
      host: this.addressForm.controls['host'].value,
      port: this.addressForm.controls['port'].value
    });

    this.setMessages();
  }

  private setAlertErrorMessage(defaultMsg?: string): void {
    const properties = WebSocketUtil.getCurrentWebSocketProperties();
    this.alertErrorMessage = defaultMsg ? defaultMsg : `Connection to ${properties.host}:${properties.port} failed`;
  }

  private setAlertSuccessMessage(): void {
    const properties = WebSocketUtil.getCurrentWebSocketProperties();
    this.alertSuccessMessage = `Connected to ${properties.host}:${properties.port}`;
  }

  public setMessages(defaultMsg?: string): void {
    // TODO: Only set this error message, if an error occurred
    this.setAlertErrorMessage(defaultMsg);

    // TODO: Only set this success message, if the connection was successful
    this.setAlertSuccessMessage();
  }

  public disconnect(): void {
    // TODO: Implement me!
  }
}
