import {Injectable} from '@angular/core';
import {WebSocketService} from '../web-socket/web-socket.service';
import {BehaviorSubject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/webSocket';
import {ServerProperties} from '../../properties/server.properties';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {Utils} from '../../utils/Utils';
import {WebSocketProperties} from '../../model/web-socket/web-socket.properties.model';

/**
 * This service class gets the data from an FMS end point and provides functions for that data
 */
@Injectable({
  providedIn: 'root'
})
export class FmsDataService {

  /**
   * The websocket connection to the server
   */
  private static webSocketSubject: WebSocketSubject<Array<NameValuePair>>;

  /**
   * The global FMSData
   * accessible via {@link FmsDataService.getData}
   */
  private static fms: Array<NameValuePair>;

  /**
   * A subject which can be subscribed to for telling, if any FMS data are present
   */
  private static presentSubject = new BehaviorSubject<boolean>(false);

  /**
   * The global indicator for telling, if the FMS data is present
   */
  public static isDataPresent: boolean;

  /**
   * The global indicator for telling, if an error in the WebSocket occurred
   */
  public static hasErrorOccurred: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    // Open a websocket to the server,which will last over the whole application
    FmsDataService.newConnection(ServerProperties.SERVER_FMS_PROPERTIES);
  }

  /**
   * Returns an immutable array of the actual FMS data
   */
  public static getData(): Array<NameValuePair> {
    return [...FmsDataService.fms];
  }

  /**
   * Returns the value to a given path
   * @param path to a variable
   * @use get("status/flags") returns an array
   */
  public static getValue(path: string): string | number | boolean | Array<NameValuePair> {
    return Utils.getValueFromTree(path, FmsDataService.fms);
  }

  /**
   * Creates a new connection to a server and overrides the default connection defined in environment.ts
   * @param webSocketProperties the properties containing the necessary data for connecting to the server
   */
  public static newConnection(webSocketProperties: WebSocketProperties): void {

    // Clear the current FMS object
    FmsDataService.resetService();

    FmsDataService.hasErrorOccurred = false;

    // Connect the service to the server
    WebSocketService.connectWebSocket(FmsDataService.webSocketSubject, webSocketProperties, FmsDataService.onMessage, FmsDataService.onError);

    // In order for the components to get notified whether the service has changed, we need to subscribe to changes
    FmsDataService.presentSubject.asObservable().subscribe(bool => FmsDataService.isDataPresent = bool);
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual fms data
   */
  private static onMessage(msg: Array<NameValuePair>): any {
    // Parse the received message to a FMS object
    FmsDataService.fms = msg;

    // Send to all subscribers, that there is a new FMS object
    FmsDataService.presentSubject.next(Utils.hasData(FmsDataService.fms));
  }

  private static onError(err: Error): any {
    // Called if the WebSocket API signals some kind of error

    // Clear the FMS object
    FmsDataService.resetService();

    // Notify the user that an error has occurred
    FmsDataService.hasErrorOccurred = true;
  }

  /**
   * Resets all values to a fresh start
   * This is needed when we create a new connection or when an error occurred
   */
  private static resetService(): void {
    FmsDataService.fms = null;
    FmsDataService.webSocketSubject = null;
    FmsDataService.presentSubject = new BehaviorSubject<boolean>(false);
  }
}
