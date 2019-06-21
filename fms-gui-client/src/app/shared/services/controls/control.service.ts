import {Injectable} from '@angular/core';
import {Control} from '../../model/control.model';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {ServerProperties} from '../../properties/server.properties';
import {WebSocketService} from '../../model/service/web-socket.model';

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class ControlService extends WebSocketService<Control> {

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    super();

    WebSocketUtil.registerService(this);

    this.path = ServerProperties.SERVER_CONTROLS_PROPERTIES.path;

    // Open a websocket to the server, which will last over the whole application
    WebSocketUtil.newConnection(ServerProperties.SERVER_CONTROLS_PROPERTIES);
  }

  /**
   * Sends a message to the server
   * @param control the control to be sent
   */
  public sendMessage(control: Control): void {
    this.webSocketSubject.next([control]);
  }
}

