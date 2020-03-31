import {Injectable} from '@angular/core';
import {Logger} from '../../logger/logger';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {WebSocketProperties} from '../../model/web-socket/web-socket.properties.model';
import {WebSocketService} from '../../model/service/web-socket.service.model';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketUtil {

  /**
   * This contains all WebSocket connections to the server
   * It is needed for updating all services about a connection change
   */
  private static webSocketServiceArray: Array<WebSocketService<any>> = [];

  /**
   * Contains the current host and port of the connection
   */
  private static currentWebSocketProperties: WebSocketProperties = {};

  /**
   * The subject for indicating, if webSocket properties exist
   */
  private static webSocketPropertiesSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public static webSocketProperties$: Observable<boolean> = WebSocketUtil.webSocketPropertiesSource.asObservable();

  /**
   * Creates a new connection to a server with the given properties and overrides the current one
   * (only one connection at the same time possible)
   * @param webSocketProperties the properties containing the necessary data for connecting to the server
   */
  public static newConnection(webSocketProperties: WebSocketProperties): void {

    // Set the current connection properties
    this.currentWebSocketProperties = webSocketProperties;
    WebSocketUtil.webSocketPropertiesSource.next(true);

    // Connect all services to the server
    this.webSocketServiceArray.forEach(service => {

      // Close the previous connections
      if (service.webSocketSubject) {
        service.webSocketSubject.complete();
      }

      // Clear the current service object
      service.clearService();

      // Set the correct path for the service, e.g. /subscribe/fms for the FmsDataService
      webSocketProperties.path = service.path;

      // Connect the service to the server with the given properties
      WebSocketUtil.connectWebSocket(service, webSocketProperties);

      // In order for the components to get notified whether the service has changed, we need to subscribe to changes
      service.dataPresent$.subscribe(bool => service.isDataPresent = bool);
    });
  }

  /**
   * Opens a WebSocket to the server and reacts to changes
   * @param webSocketService the service to connect to, e.g. {@link FmsDataService} or {@link CardsService}
   * @param socketProperties the properties
   */
  public static connectWebSocket<T>(
    webSocketService: WebSocketService<T>,
    socketProperties: WebSocketProperties
  ): WebSocketSubject<Array<T>> {
    if ((webSocketService.webSocketSubject === null || webSocketService.webSocketSubject === undefined)) {
      return WebSocketUtil.createWebSocket(webSocketService, socketProperties);
    }
    return webSocketService.webSocketSubject;
  }

  /**
   * Creates a new {@link WebSocketSubject}
   * @param webSocketService the websocket service reference needed for creating a new connection
   * @param socketProperties the properties object containing the information for the connection
   */
  private static createWebSocket<T>(
    webSocketService: WebSocketService<T>,
    socketProperties: WebSocketProperties
  ): WebSocketSubject<Array<T>> {

    const openObserver = new Subject();

    // Create the WebSocket object
    // The first parameter is the url to the web socket
    // The second parameter is the subject,that watches when open events occur on the underlying web socket
    webSocketService.webSocketSubject = webSocket({
      url: WebSocketUtil.createUrl(socketProperties),
      openObserver: openObserver
    });

    // Add an 'open' listener -> if the connection is open, then no error has occurred
    openObserver.asObservable().subscribe(() => webSocketService.errorPresentSource.next(false));

    // Subscribe to the WebSocket object
    webSocketService.webSocketSubject.subscribe(
      msg => webSocketService.onMessage(msg),
      err => webSocketService.onError(err),
      () => Logger.log('Close connection')
    );

    // Make the error subject's value undefined, since we don't know, if an error has already occurred or not
    webSocketService.errorPresentSource.next(undefined);

    return webSocketService.webSocketSubject;
  }

  /**
   * Creates the URL for connecting to a server
   * @param properties contains the information for connecting to the server
   */
  public static createUrl(properties: WebSocketProperties): string {
    // Define a default port, if there is no port
    if (!properties.port) {
      properties.port = 80;
    }

    let protocol = 'wss';

    // If there is no security, assume simple TCP connection
    if (!properties.secure) {
      protocol = 'ws';
    }

    // Define default path (root)
    if (!properties.path) {
      properties.path = '';
    }

    return protocol + '://' + properties.host + ':' + properties.port + properties.path;
  }

  /**
   * Completes and disconnects all web sockets
   */
  public static disconnectAll(): void {
    this.webSocketServiceArray.forEach(service => {
      if (service.webSocketSubject) {
        service.webSocketSubject.complete();
      }
      service.clearService();
    });
  }


  /**
   * Push the requesting service to the service array, for notifying the remaining services about a connection change
   * @param webSocketService the service to be included in the array
   */
  public static registerService<T>(webSocketService: WebSocketService<T>): void {
    if (!this.webSocketServiceArray.includes(webSocketService)) {
      this.webSocketServiceArray.push(webSocketService);
    }
  }

  /**
   * Returns the current connection properties
   */
  public static get webSocketProperties(): WebSocketProperties {
    return this.currentWebSocketProperties;
  }
}
