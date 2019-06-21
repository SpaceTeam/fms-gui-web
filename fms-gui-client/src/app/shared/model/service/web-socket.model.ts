import {Service} from './service.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject} from 'rxjs';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {Utils} from '../../utils/Utils';

export abstract class WebSocketService<T> implements Service {

  /**
   * The websocket connection to the server
   */
  webSocketSubject: WebSocketSubject<Array<T>>;

  /**
   * The subject for indicating, if data is available or not
   */
  presentSubject: BehaviorSubject<boolean>;

  /**
   * The global indicator for telling, if the cards data is present
   *
   */
  isDataPresent: boolean;

  /**
   * The global indicator for telling, if an error in the WebSocket occurred
   */
  hasErrorOccurred: boolean;

  /**
   * The data container for a service
   */
  data: Array<T>;

  /**
   * Defines what happens, if a message was received
   * @param msg the message
   */
  onMessage(msg: Array<T>): any {
    // Parse the received message to a FMS object
    this.data = msg;

    // Send to all subscribers, that there is a new FMS object
    this.presentSubject.next(Utils.hasData(this.data));
  }

  /**
   * Defines what happens, if an error occurred during the web socket connection
   * @param err the error
   */
  onError(err: any): any {
    // Called if the WebSocket API signals some kind of error

    // Clear the service object
    WebSocketUtil.resetService(this);

    // Notify the user that an error has occurred
    this.hasErrorOccurred = true;
  }

  /**
   * Returns an immutable array of the webservice's data
   */
  getData(): Array<T> {
    return [...this.data];
  }
}
