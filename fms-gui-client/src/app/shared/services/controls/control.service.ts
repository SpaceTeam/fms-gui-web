import {Injectable} from '@angular/core';
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
  public isDataPresent: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    // Open a websocket to the server, which will last over the whole application
    ControlService.webSocketSubject = WebSocketService.connectWebSocket(
      ControlService.webSocketSubject,
      ServerProperties.SERVER_CONTROLS_PROPERTIES,
      ControlService.onMessage
    );
    ControlService.presentSubject.asObservable().subscribe(bool => this.isDataPresent = bool);
  }

  /**
   * Returns the actual Control data
   */
  public static getData(): Array<Control> {
    return ControlService.controls;
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

  /**
   * Sends a message to the server
   * @param control the control to be sent
   */
  public static sendMessage(control: Control): void {
    ControlService.webSocketSubject.next([control]);
  }
}

