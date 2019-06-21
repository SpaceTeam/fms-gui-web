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

    return protocol + '://' + properties.host + ':' + properties.port + '/' + properties.path;
  }

  /**
   * Opens a WebSocket to the server and reacts to changes
   * @param webSocketService
   * @param socketProperties
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
      () => Logger.log('complete')
    );

    return webSocketService.webSocketSubject;
  }

  /**
   * Creates a new connection to a server and overrides the default connection defined in environment.ts
   * @param webSocketService the service, in which the method was called
   * @param webSocketProperties the properties containing the necessary data for connecting to the server
   */
  public static newConnection<T>(webSocketService: WebSocketService<T>, webSocketProperties: WebSocketProperties): void {

    // Clear the current FMS object
    WebSocketUtil.resetService(webSocketService);

    webSocketService.hasErrorOccurred = false;

    // Connect the service to the server
    // WebSocketUtil.connectWebSocket(this.webSocketSubject, webSocketProperties, this.onMessage, this.onError);
    WebSocketUtil.connectWebSocket(webSocketService, webSocketProperties);

    // In order for the components to get notified whether the service has changed, we need to subscribe to changes
    webSocketService.presentSubject.asObservable().subscribe(bool => webSocketService.isDataPresent = bool);
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
}
