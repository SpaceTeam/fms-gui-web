import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Control} from '../../model/control.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import {WebSocketService} from '../web-socket/web-socket.service';
import {ServerProperties} from '../../properties/server.properties';
import {Utils} from '../../utils/Utils';
import {WebSocketProperties} from '../../model/web-socket/web-socket.properties.model';

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class ControlService {

  /**
   * The websocket connection to the server
   */
  private static webSocketSubject: WebSocketSubject<Array<Control>>;

  /**
   * The global Control data
   * accessible via {@link ControlService.getData}
   */
  private static controls: Array<Control>;

  /**
   * A subject which can be subscribed to for telling, if any control data are present
   */
  private static presentSubject = new BehaviorSubject<boolean>(false);

  /**
   * The global indicator for telling, if the Control data is present
   */
  public static isDataPresent: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    // Open a websocket to the server, which will last over the whole application
    ControlService.newConnection(ServerProperties.SERVER_CONTROLS_PROPERTIES);
  }

  /**
   * Returns the actual Control data
   */
  public static getData(): Array<Control> {
    return ControlService.controls;
  }

  /**
   * Creates a new connection to a server and overrides the default connection defined in environment.ts
   * @param webSocketProperties the properties containing the necessary data for connecting to the server
   */
  public static newConnection(webSocketProperties: WebSocketProperties): void {

    // Clear the current Cards object
    ControlService.resetService();

    // Connect the service to the server
    WebSocketService.connectWebSocket(ControlService.webSocketSubject, webSocketProperties, ControlService.onMessage, ControlService.onError);

    ControlService.presentSubject.asObservable().subscribe(bool => this.isDataPresent = bool);
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual control data
   */
  private static onMessage(msg: Array<Control>): any {
    // Parse the received message to a Control object
    ControlService.controls = msg;

    // Send to all subscribers, that there is a new Control object
    ControlService.presentSubject.next(Utils.hasData(ControlService.controls));
  }

  private static onError(err: any): any {
    // Logger.error(err);

    // Clear the Controls object
    ControlService.resetService();
  }

  /**
   * Resets all values to a fresh start
   * This is needed when we create a new connection or when an error occurred
   */
  private static resetService(): void {
    ControlService.controls = null;
    ControlService.webSocketSubject = null;
    ControlService.presentSubject = new BehaviorSubject<boolean>(false);
  }

  /**
   * Sends a message to the server
   * @param control the control to be sent
   */
  public static sendMessage(control: Control): void {
    ControlService.webSocketSubject.next([control]);
  }
}

