import {Injectable} from '@angular/core';
import {Logger} from '../../logger/logger';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {WebSocketProperties} from '../../model/web-socket/web-socket.properties.model';
import {WebSocketService} from '../../model/service/web-socket.model';
import {BehaviorSubject} from 'rxjs';

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
  private static currentWebSocketProperties: WebSocketProperties = {
    host: '',
    port: 0,
    path: ''
  };

  /**
   * Opens a WebSocket to the server and reacts to changes
   * @param webSocketService the service to connect to, e.g. {@link FmsDataService} or {@link CardsService}
   * @param socketProperties the properties
   */
  public static connectWebSocket<T>(
    webSocketService: WebSocketService<T>,
    socketProperties: WebSocketProperties
  ): WebSocketSubject<Array<T>> {
    if (webSocketService.webSocketSubject === null || webSocketService.webSocketSubject === undefined) {
      return WebSocketUtil.createWebSocket(webSocketService, socketProperties);
    }
    return webSocketService.webSocketSubject;
  }

  /**
   * Creates a new {@link WebSocketSubject}
   * @param webSocketService
   * @param socketProperties
   */
  private static createWebSocket<T>(
    webSocketService: WebSocketService<T>,
    socketProperties: WebSocketProperties
  ): WebSocketSubject<Array<T>> {
    webSocketService.webSocketSubject = webSocket(WebSocketUtil.createUrl(socketProperties));

    webSocketService.webSocketSubject.subscribe(
      msg => webSocketService.onMessage(msg),
      err => webSocketService.onError(err),
      () => Logger.log('Close connection')
    );

    return webSocketService.webSocketSubject;
  }

  /**
   * Creates the URL for connecting to a server
   * @param properties contains the information for connecting to the server
   */
  public static createUrl(properties: WebSocketProperties): string {
    // Define a default port, if the port is not given
    if (!properties.port) {
      properties.port = 80;
    }

    let protocol = 'wss';

    // If security is not given, assume simple TCP connection
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
   * Push the requesting service to the service array, for notifying the remaining services about a connection change
   * @param webSocketService the service to be included in the array
   */
  public static registerService<T>(webSocketService: WebSocketService<T>): void {
    if (!this.webSocketServiceArray.includes(webSocketService)) {
      this.webSocketServiceArray.push(webSocketService);
    }
  }

  /**
   * Creates a new connection to a server and overrides the default connection defined in environment.ts
   * @param webSocketProperties the properties containing the necessary data for connecting to the server
   */
  public static newConnection(webSocketProperties: WebSocketProperties): void {

    // Set the current connection properties
    this.currentWebSocketProperties = webSocketProperties;

    // Connect all services to the server
    this.webSocketServiceArray.forEach(service => {

      // Close the previous connections
      if (service.webSocketSubject) {
        service.webSocketSubject.complete();
      }

      // Clear the current service object
      WebSocketUtil.resetService(service);

      service.hasErrorOccurred = false;

      // Set the correct path for the service, e.g. /subscribe/fms for the FmsDataService
      webSocketProperties.path = service.path;

      // Connect the service to the server with the given properties
      WebSocketUtil.connectWebSocket(service, webSocketProperties);

      // In order for the components to get notified whether the service has changed, we need to subscribe to changes
      service.presentSubject.asObservable().subscribe(bool => service.isDataPresent = bool);
    });
  }

  /**
   * Resets all values of a service to a fresh start
   * This is needed when we create a new connection or when an error occurred
   */
  public static resetService<T>(webSocketService: WebSocketService<T>): void {
    webSocketService.data = null;
    webSocketService.webSocketSubject = null;
    webSocketService.presentSubject = new BehaviorSubject<boolean>(false);
  }

  /**
   * Returns the current connection properties
   */
  public static getCurrentWebSocketProperties(): WebSocketProperties {
    return this.currentWebSocketProperties;
  }
}
