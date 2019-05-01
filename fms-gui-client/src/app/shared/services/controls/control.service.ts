import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Control} from '../../model/control.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import {WebSocketService} from '../web-socket/web-socket.service';
import {ServerProperties} from '../../properties/server.properties';
import {Utils} from '../../utils/Utils';

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
  private static readonly webSocketSubject: WebSocketSubject<Array<Control>>;

  /**
   * The global FMSData
   * accessible via {@link FmsDataService.getData}
   */
  private static controls: Array<Control>;

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
    WebSocketService.connectWebSocket(ControlService.webSocketSubject, ServerProperties.SERVER_CONTROLS_PROPERTIES, ControlService.onMessage);
    ControlService.presentSubject.asObservable().subscribe(bool => this.isDataPresent = bool);
  }

  /**
   * Returns the actual FMS data
   */
  public static getData(): Array<Control> {
    return ControlService.controls;
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual fms data
   */
  private static onMessage(msg: Array<Control>): any {
    // Parse the received message to a FMS object
    ControlService.controls = msg;

    // Send to all subscribers, that there is a new FMS object
    ControlService.presentSubject.next(Utils.hasData(ControlService.controls));
  }
}

