import { Injectable } from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {BehaviorSubject} from 'rxjs';
import {WebSocketService} from '../web-socket/web-socket.service';
import {ServerProperties} from '../../properties/server.properties';
import {Utils} from '../../utils/Utils';
import {FmsDataService} from '../fms-data/fms-data.service';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  /**
   * The websocket connection to the server
   */
  private static readonly webSocketSubject: WebSocketSubject<Array<NameValuePair>>;

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
  public isDataPresent: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor(private fmsDataService: FmsDataService) {
    // Open a websocket to the server, which will last over the whole application
    WebSocketService.connectWebSocket(CardsService.webSocketSubject, ServerProperties.SERVER_CARDS_PROPERTIES, CardsService.onMessage);
    CardsService.presentSubject.asObservable().subscribe(bool => this.isDataPresent = bool);
  }

  /**
   * Returns the actual Cards data
   */
  public static getData(): Array<NameValuePair> {
    return CardsService.cards;
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
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual cards data
   */
  private static onMessage(msg: Array<NameValuePair>): any {
    // Parse the received message to a FMS object
    CardsService.cards = msg;

    // Send to all subscribers, that there is a new FMS object
    CardsService.presentSubject.next(Utils.hasData(CardsService.cards));
  }
}
