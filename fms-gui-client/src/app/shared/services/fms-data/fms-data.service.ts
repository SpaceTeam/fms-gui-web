import { Injectable } from '@angular/core';
import { FMSData } from '../../model/fms-data/fms-data.model';
import { Observable, of } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {WebSocketService} from '../web-socket/web-socket.service';
import {environment as env} from '../../../../environments/environment';

const optionsTime = {
  hour: '2-digit',
  minute: '2-digit'
};

/**
 * This service class gets the data from an FMS end point and provides functions for that data
 */
@Injectable({
  providedIn: 'root'
})
export class FmsDataService {

  /**
   * Contains the url of the server where we can get the json file
   * TODO: Change from 'assets' to the server's url, containing the files
   */
  private url = 'assets';

  /**
   * Contains the url of the json
   */
  private jsonUrl = '/mocks/mock.fms.json';

  /**
   * Contains the url of the schema
   * TODO: Create a JSON schema for the FMS JSON files
   */
  private schemaUrl = '';

  /**
   * The connection to the WebSocket
   */
  private connection: WebSocket = null;

  /**
   * The global FMSData
   */
  private fms: FMSData;

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {
    // Open a websocket to the server, which will last over the whole application
    WebSocketService.openWebSocket(
      this.connection,
      {
        host: env.server.host,
        port: env.server.port,
        path: env.server.subscribe,
        secure: env.server.secure
      },
      this.onOpen,
      this.onMessage,
      this.onClose
    );
  }

  /**
   * Retrieves a FMS JSON from the server and returns it to the client
   * TODO: Change this to be more dynamic -> instead of creating an FMSData object,
   * get the simple JSON => We need this for e.g. making dynamic cards possible
   * @return returns an observable of an FMS object
   */
  getData(): Observable<FMSData> {
    const d = new Date();
    return this.http.get<FMSData>(this.url + this.jsonUrl)
      .pipe(
        // TODO: Save this to a log file
        // tap(() => console.log(`Fetched FMSData at ${d.toLocaleTimeString('de', optionsTime)}`)),
        catchError(this.handleError<FMSData>(`get fms data at ${d.toLocaleTimeString('de', optionsTime)}`))
      );
  }

  /**
   * This is just a dummy method, which tests, if the connection to the server works
   */
  printServerResponse(): void {
    let url: string = 'http://' + env.server.host + ':' + env.server.port;
    this.http.get<JSON>(url)
      .toPromise()
      .then(res => {
        console.log("Print Server Response: " + res['message']);
      });
  }

  /**
   * This method defines what should happen on the client part as soon as the WebSocket connection is established
   * @param event
   */
  private onOpen(this: WebSocket, event: Event): void {
    console.log('WebSocket open');
  }

  private onMessage(this: WebSocket, event: MessageEvent): void {
    console.log('Sent WebSocket message');
  }

  private onClose(this: WebSocket, event: CloseEvent): void {
    console.log('WebSocket close');
    this.close();
  }

  /**
   * Handles the error we can get, if an operation failed
   * @param operation the operation which failed
   * @param result the result of the operation
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
