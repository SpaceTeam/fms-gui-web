import {Injectable} from '@angular/core';
import {Control} from '../../model/control.model';
import {WebSocketService} from '../../model/service/web-socket.service.model';

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class ControlService extends WebSocketService<Control> {

  /**
   * Sends a message to the server
   * @param control the control to be sent
   */
  public sendMessage(control: Control): void {
    this.webSocketSubject.next([control]);
  }
}
