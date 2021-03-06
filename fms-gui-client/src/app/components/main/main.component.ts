import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {WebSocketUtil} from '../../shared/utils/web-socket/web-socket.util';
import {FmsDataService} from '../../shared/services/fms-data/fms-data.service';
import {AlertTypeEnum} from '../../shared/enums/alert-type.enum';
import {Subscription} from 'rxjs';
import {AlertMessage} from '../../shared/model/alert/alert-message';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Main Page';

  /**
   * The default error message, when the value of an input field is not correct
   */
  errorMessageInput = 'You must enter a value';

  /**
   * An indicator, telling if a click event has occurred or not
   */
  clicked: boolean;

  /**
   * An indicator, telling what kind of alert should be displayed
   */
  activeAlert: AlertTypeEnum;

  private isPropertiesAvailableSubscription: Subscription;
  isPropertiesAvailable: boolean;

  private isConnectedSubscription: Subscription;
  isConnected: boolean;

  private errorSubscription: Subscription;

  // TODO: Store the messages in some properties file
  errorMessage: string;
  successMessage: string;
  warningMessage: string;
  informationMessage: string;

  addressForm = this.fb.group({
    host: ['', [Validators.required]],
    port: ['', [Validators.required]]
  });

  constructor(private fmsDataService: FmsDataService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.clicked = false;
    this.isPropertiesAvailable = false;
    this.isConnected = false;

    this.setActiveAlert(false);
    this.setAlertMessages();

    this.addErrorListener();
    this.addWebSocketInfoAvailableListener();
    this.addConnectionListener();
  }

  /**
   * Listens to the FmsDataService's error subject, in case an error occurred (either failed connection or other events)
   * and sets the current active alert type
   */
  private addErrorListener(): void {
    this.errorSubscription = this.fmsDataService.errorPresent$.subscribe(hasErrorOccurred => this.setActiveAlert(hasErrorOccurred));
  }

  private addWebSocketInfoAvailableListener(): void {
    this.isPropertiesAvailableSubscription =
      WebSocketUtil.webSocketProperties$.subscribe(propertiesAvailable => this.isPropertiesAvailable = propertiesAvailable);
  }

  private addConnectionListener(): void {
    this.isConnectedSubscription = this.fmsDataService.dataPresent$.subscribe(isConnected => this.isConnected = isConnected);
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.isPropertiesAvailableSubscription.unsubscribe();
    this.isConnectedSubscription.unsubscribe();
  }

  /**
   * Sets the current active alert type
   * @param hasErrorOccurred true, if an error has occurred; false if not; undefined, if it is unclear if an error has already occurred
   */
  private setActiveAlert(hasErrorOccurred?: boolean) {
    // Check, whether we have an actual error value, or if we are still connecting
    if (hasErrorOccurred !== undefined) {
      this.setAlertMessages();

      if (!this.clicked) {
        this.activeAlert = (this.fmsDataService.webSocketSubject !== null)
          ? AlertTypeEnum.INFORMATION
          : AlertTypeEnum.WARNING;
      } else {
        this.activeAlert = (this.fmsDataService.webSocketSubject !== null && !hasErrorOccurred)
          ? AlertTypeEnum.SUCCESS
          : AlertTypeEnum.ERROR;
      }
    }
  }

  /**
   * Submits the current form
   */
  submit() {
    this.clicked = true;

    WebSocketUtil.newConnection({
      host: this.addressForm.controls['host'].value,
      port: this.addressForm.controls['port'].value
    });

    this.displayConnectMessage();
  }

  /**
   * Sets the messages of the alert component
   */
  private setAlertMessages(): void {
    const properties = WebSocketUtil.webSocketProperties;
    this.errorMessage = `Failed to connect to ${properties.host}:${properties.port}`;
    this.successMessage = `Connection to ${properties.host}:${properties.port} was successful`;
    this.informationMessage = `Connected to ${properties.host}:${properties.port}`;
    this.warningMessage = `No connection`;
  }

  /**
   * Disconnects the app from the current connection
   */
  public disconnect(): void {
    const properties = WebSocketUtil.webSocketProperties;
    if (properties.host && properties.port) {
      this.informationMessage = `Disconnected from ${properties.host}:${properties.port}`;
      this.activeAlert = AlertTypeEnum.INFORMATION;
      WebSocketUtil.disconnectAll();
    }
  }

  connectToPrevious(): void {
    const properties = WebSocketUtil.webSocketProperties;
    if (properties.host && properties.port) {
      this.displayConnectMessage();
      WebSocketUtil.newConnection(properties);
    }
  }

  displayConnectMessage(): void {
    this.informationMessage = `Connecting to ${WebSocketUtil.webSocketProperties.host}:${WebSocketUtil.webSocketProperties.port}...`;
    this.activeAlert = AlertTypeEnum.INFORMATION;
  }

  get isAlreadyConnectedToProperties(): boolean {
    const properties = WebSocketUtil.webSocketProperties;
    return this.addressForm.controls['host'].value === properties.host
      && this.addressForm.controls['port'].value === properties.port
      && this.isConnected;
  }
}
