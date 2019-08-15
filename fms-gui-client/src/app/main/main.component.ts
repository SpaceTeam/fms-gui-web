import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {WebSocketUtil} from '../shared/utils/web-socket/web-socket.util';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';

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

  errorMessageInput = 'You must enter a value';

  clicked: boolean;

  errorMessage: string;
  successMessage: string;
  warningMessage: string;
  informationMessage: string;

  // TODO: Store those messages in some properties file
  alertErrorMessage: string;
  alertSuccessMessage: string;
  alertWarningMessage: string;
  alertInformationMessage: string;

  addressForm = this.fb.group({
    host: ['', [Validators.required]],
    port: ['', [Validators.required]],
    path: ['']
  });

  WebSocketUtil = WebSocketUtil;

  constructor(private fmsDataService: FmsDataService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.setMessages();

    this.clicked = false;

    this.addMessageListener();
  }

  private addMessageListener(): void {
    WebSocketUtil.webSocketSubjectObservable(this.fmsDataService).subscribe(subject => {
      this.resetMessages();
      if (subject) {
        console.log("Subject available");
        // Display the information if no click occurred
        // Otherwise display the success message
        if (!this.clicked) {
          this.informationMessage = this.alertInformationMessage;
        } else {
          this.successMessage = this.alertSuccessMessage;
        }
      } else {
        console.log("Subject NOT available");
        // Display the warning if no click occurred
        // Otherwise display the error message
        if (!this.clicked) {
          this.warningMessage = this.alertWarningMessage;
        } else {
          this.errorMessage = this.alertErrorMessage;
        }
      }
    });
  }

  onSubmit() {

    //this.clicked = true;

    WebSocketUtil.newConnection({
      host: this.addressForm.controls['host'].value,
      port: this.addressForm.controls['port'].value
    });

    //this.setMessages();
  }

  /**
   * Sets the messages of the alert component
   */
  private setMessages(): void {
    const properties = WebSocketUtil.getCurrentWebSocketProperties();
    this.alertErrorMessage = `Failed to connect to ${properties.host}:${properties.port}`;
    this.alertSuccessMessage = `Connection to ${properties.host}:${properties.port} was successful`;
    this.alertInformationMessage = `Connected to ${properties.host}:${properties.port}`;
    this.alertWarningMessage = `No connection`;
  }

  private resetMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.informationMessage = null;
    this.warningMessage = null;
  }

  public disconnect(): void {
    // TODO: Implement me!
  }
}
