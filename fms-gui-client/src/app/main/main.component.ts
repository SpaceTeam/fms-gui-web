import {Component, OnInit} from '@angular/core';
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

  /**
   * The error message for the alert
   */
  alertErrorMessage: string;

  /**
   * The success message for the alert
   */
  alertSuccessMessage: string;

  /**
   * The 'No connection' message for the alert
   */
  alertNoConnectionMessage: string;

  /**
   * The 'Connected to' message for the alert
   */
  alertConnectionMessage: string;

  addressForm = this.fb.group({
    host: ['', [Validators.required]],
    port: ['', [Validators.required]],
    path: ['']
  });

  WebSocketUtil = WebSocketUtil;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.setMessages();
  }

  onSubmit() {
    WebSocketUtil.newConnection({
      host: this.addressForm.controls['host'].value,
      port: this.addressForm.controls['port'].value
    });
  }

  /**
   * Sets the messages of the alert component
   */
  public setMessages(): void {
    const properties = WebSocketUtil.getCurrentWebSocketProperties();
    this.alertErrorMessage = `Failed to connect to ${properties.host}:${properties.port}`;
    this.alertSuccessMessage = `Connection to ${properties.host}:${properties.port} was successful`;
    this.alertConnectionMessage = `Connected to ${properties.host}:${properties.port}`;
    this.alertNoConnectionMessage = `No connection`;
  }

  public disconnect(): void {
    // TODO: Implement me!
  }
}
