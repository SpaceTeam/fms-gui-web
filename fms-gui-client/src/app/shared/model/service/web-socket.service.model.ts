import {Service} from './service.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject} from 'rxjs';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {NameValuePairUtils} from '../../utils/NameValuePairUtils';

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
   * Contains all data, that was ever received since the start of the application
   */
  allData: Array<Array<T>> = [];

  /**
   * The path to the server for this service
   */
  path: string;

  /**
   * Defines what happens, if a message was received
   * @param msg the message
   */
  onMessage(msg: Array<T>): any {
    // Parse the received message to a FMS object
    this.data = msg;

    // Add the data to the array containing all the data since the beginning
    this.allData.push(msg);

    // Send to all subscribers, that there is new data
    this.presentSubject.next(NameValuePairUtils.hasData(this.data));
  }

  /**
   * Defines what happens, if an error occurred during the web socket connection
   * Called if the WebSocket API signals some kind of error
   * @param err the error
   */
  onError(err: any): any {
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

  /**
   * Returns an immutable array of all data received since the start of the application
   */
  getAllData(): Array<Array<T>> {
    return [...this.allData];
  }

  /**
   * Returns the indices of the changed entries in the received data
   */
  getIndicesOfChangedData(): Array<number> {

    const changedValues: Array<number> = [];

    const currentData = this.allData[this.allData.length - 1];
    const lastData = this.allData[this.allData.length - 2];

    // TODO: It should be possible to change this into a filter operation -> Do it as soon as you have an internet connection
    for (let i = 0; i < this.allData.length; i++) {
      if (currentData[i] !== lastData[i]) {
        changedValues.push(i);
      }
    }

    return changedValues;
  }

  /**
   * Prints all previous data into the file name provided
   * @param path the path to the file
   * @param fileName the name of the new file
   */
  printData(path: string, fileName: string): void {
    // TODO: Create a dialog for saving the data (download functionality)
    // TODO: Provide the possibility to save it as CSV
  }
}