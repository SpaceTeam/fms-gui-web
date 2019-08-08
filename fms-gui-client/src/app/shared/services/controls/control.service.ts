import {Injectable} from '@angular/core';
import {Control} from '../../model/control.model';
import {WebSocketService} from '../../model/service/web-socket.service.model';
import {ServerProperties} from '../../properties/server.properties';
import SERVER_CONTROLS_PROPERTIES = ServerProperties.SERVER_CONTROLS_PROPERTIES;

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class ControlService extends WebSocketService<Control> {

  constructor() {
    super(SERVER_CONTROLS_PROPERTIES.path);
  }

  /**
   * Sends a message to the server
   * @param control the control to be sent
   */
  public sendMessage(control: Control): void {
    this.webSocketSubject.next([control]);
  }
}
