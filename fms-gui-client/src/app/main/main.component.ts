import {Component, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ServerProperties} from '../shared/properties/server.properties';
import {WebSocketProperties} from '../shared/model/web-socket/web-socket.properties.model';
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

  /**
   * The separator between labels and texts
   */
  separator = ':';

  errorMessage: string = 'You must enter a value';

  alertErrorMessage: string;
  alertSuccessMessage: string;

  addressForm = this.fb.group({
    host: ['', [Validators.required]],
    port: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private fmsDataService: FmsDataService) {
  }

  ngOnInit() {
    this.setMessages(ServerProperties.SERVER_FMS_PROPERTIES, 'No connection');
  }

  onSubmit() {

    this.setMessages();

    WebSocketUtil.newConnection({
      host: this.addressForm.controls['host'].value,
      port: this.addressForm.controls['port'].value
    });
  }

  private setAlertErrorMessage(webSocketProperties?: WebSocketProperties, defaultMsg?: string): void {
    let host = (webSocketProperties ? webSocketProperties.host : this.addressForm.controls['host'].value);
    let port = (webSocketProperties ? webSocketProperties.port : this.addressForm.controls['port'].value);
    this.alertErrorMessage = defaultMsg ? defaultMsg : `Connection to ${host}:${port} failed`;
  }

  private setAlertSuccessMessage(webSocketProperties?: WebSocketProperties): void {
    let host = (webSocketProperties ? webSocketProperties.host : this.addressForm.controls['host'].value);
    let port = (webSocketProperties ? webSocketProperties.port : this.addressForm.controls['port'].value);
    this.alertSuccessMessage = `Connected to ${host}:${port}`;
  }

  public setMessages(webSocketProperties?: WebSocketProperties, defaultMsg?: string): void {
    // TODO: Only set this error message, if an error occurred
    this.setAlertErrorMessage(webSocketProperties, defaultMsg);

    // TODO: Only set this success message, if the connection was successful
    this.setAlertSuccessMessage(webSocketProperties);
  }

  public disconnect(): void {
    this.alertErrorMessage = 'Disconnected';
    WebSocketUtil.newConnection(null);
  }
}
