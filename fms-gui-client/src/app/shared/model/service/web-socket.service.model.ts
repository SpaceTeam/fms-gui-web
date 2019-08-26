import {Service} from './service.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject, Observable} from 'rxjs';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {NameValuePairUtils} from '../../utils/NameValuePairUtils';

export abstract class WebSocketService<T> implements Service {

  /**
   * The websocket connection to the server
   * TODO: Only allow to modify the webSocketSubject over this service
   */
  webSocketSubject: WebSocketSubject<Array<T>>;

  /**
   * The subject for indicating, if data is available or not
   */
  private dataPresentSource: BehaviorSubject<boolean>;
  dataPresent$: Observable<boolean>;

  /**
   * The global indicator for telling, if the cards data is present
   */
  isDataPresent: boolean;

  /**
   * The subject for indicating, if an error has occurred or not
   */
  errorPresentSource: BehaviorSubject<boolean>;
  errorPresent$: Observable<boolean>;

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

  protected constructor(path?: string) {
    if (path) {
      this.path = path;
    }
    // Register this service
    WebSocketUtil.registerService(this);

    // Initialize the subjects
    this.resetSources();

    // Initialize the service
    this.clearService();
  }

  /**
   * Initializes the service's 'BehaviourSubject' objects
   */
  private resetSources(): void {
    this.dataPresentSource = new BehaviorSubject<boolean>(false);
    this.errorPresentSource = new BehaviorSubject<boolean>(false);

    this.dataPresent$ = this.dataPresentSource.asObservable();
    this.errorPresent$ = this.errorPresentSource.asObservable();
  }

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
    this.dataPresentSource.next(NameValuePairUtils.hasData(this.data));
  }

  /**
   * Defines what happens, if an error occurred during the web socket connection
   * Called if the WebSocket API signals some kind of error
   * @param err the error
   */
  onError(err: any): any {
    // Clear the service object
    this.clearService();

    // Notify the user that an error has occurred
    this.errorPresentSource.next(true);
  }

  /**
   * Resets all values (except the error subject) of a service to a fresh start
   * This is needed when we create a new connection or when an error occurred
   */
  public clearService(): void {
    this.data = null;
    this.webSocketSubject = null;
    this.dataPresentSource.next(false);
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
   * Prints all previous data into the file name provided
   * @param path the path to the file
   * @param fileName the name of the new file
   */
  printData(path: string, fileName: string): void {
    // TODO: Create a dialog for saving the data (download functionality)
    // TODO: Provide the possibility to save it as CSV
  }
}
