import {Injectable} from '@angular/core';
import {WebSocketService} from '../web-socket/web-socket.service';
import {BehaviorSubject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/webSocket';
import {ServerProperties} from '../../properties/server.properties';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {Utils} from '../../utils/Utils';

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
  private static readonly webSocketSubject: WebSocketSubject<Array<NameValuePair>>;

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
   *
   */
  public isDataPresent: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    // Open a websocket to the server, which will last over the whole application
    WebSocketService.connectWebSocket(FmsDataService.webSocketSubject, ServerProperties.SERVER_FMS_PROPERTIES, FmsDataService.onMessage);
    FmsDataService.presentSubject.asObservable().subscribe(bool => this.isDataPresent = bool);
  }

  /**
   * Returns the actual FMS data
   */
  public static getData(): Array<NameValuePair> {
    return FmsDataService.fms;
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
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual fms data
   */
  private static onMessage(msg: Array<NameValuePair>): any {
    // Parse the received message to a FMS object
    FmsDataService.fms = msg;

    // Send to all subscribers, that there is a new FMS object
    FmsDataService.presentSubject.next(Utils.hasData(FmsDataService.fms));
  }
}
