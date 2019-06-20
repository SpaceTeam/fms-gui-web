import {Injectable} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {BehaviorSubject} from 'rxjs';
import {WebSocketService} from '../web-socket/web-socket.service';
import {ServerProperties} from '../../properties/server.properties';
import {Utils} from '../../utils/Utils';
import {FmsDataService} from '../fms-data/fms-data.service';
import {WebSocketProperties} from '../../model/web-socket/web-socket.properties.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  /**
   * The websocket connection to the server
   */
  private static webSocketSubject: WebSocketSubject<Array<NameValuePair>>;

  /**
   * The global CardsData
   * accessible via {@link CardsService.getData}
   */
  private static cards: Array<NameValuePair>;

  /**
   * A subject which can be subscribed to for telling, if any cards data are present
   */
  private static presentSubject = new BehaviorSubject<boolean>(false);

  /**
   * The global indicator for telling, if the cards data is present
   *
   */
  public static isDataPresent: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    // Open a websocket to the server, which will last over the whole application
    CardsService.newConnection(ServerProperties.SERVER_CARDS_PROPERTIES);
  }

  /**
   * Returns an immutable array of the actual Cards data
   */
  public static getData(): Array<NameValuePair> {
    return [...CardsService.cards];
  }

  /**
   * Returns the value to a given path
   * @param path to a variable
   * @use get("status/flags") returns an array
   */
  public static getValue(path: string): string | number | boolean | Array<NameValuePair> {
    return FmsDataService.getValue(path);
  }

  /**
   * Creates a new connection to a server and overrides the default connection defined in environment.ts
   * @param webSocketProperties the properties containing the necessary data for connecting to the server
   */
  public static newConnection(webSocketProperties: WebSocketProperties): void {

    // Clear the current Cards object
    CardsService.resetService();

    // Connect the service to the server
    WebSocketService.connectWebSocket(CardsService.webSocketSubject, webSocketProperties, CardsService.onMessage, CardsService.onError);

    CardsService.presentSubject.asObservable().subscribe(bool => this.isDataPresent = bool);
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual cards data
   */
  private static onMessage(msg: Array<NameValuePair>): any {
    // Parse the received message to a FMS object
    CardsService.cards = msg;

    // Send to all subscribers, that there is a new FMS object
    CardsService.presentSubject.next(Utils.hasData(CardsService.cards));
  }

  private static onError(err: any): any {
    // Clear the Cards object
    CardsService.resetService();
  }

  /**
   * Resets all values to a fresh start
   * This is needed when we create a new connection or when an error occurred
   */
  private static resetService(): void {
    CardsService.cards = null;
    CardsService.webSocketSubject = null;
    CardsService.presentSubject = new BehaviorSubject<boolean>(false);
  }
}
