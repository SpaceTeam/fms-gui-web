import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() { }

  /**
   * Creates a simple web-socket
   * @example host: localhost, port: 8080, path: subscribe, secure: true -> new WebSocket("wss://localhost:8080/subscribe");
   */
  static createSocket(properties: WebSocketProperties): WebSocket {

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

    return new WebSocket(protocol + '://' + properties.host + ':' + properties.port + '/' + properties.path);
  }

  /**
   * Opens a WebSocket to the server and reacts to changes
   */
  static openWebSocket(
    connection: WebSocket,
    properties: WebSocketProperties,
    onOpen?: (this: WebSocket, event: Event) => any,
    onMessage?: (event: MessageEvent) => any,
    onClose?: (this: WebSocket, event: CloseEvent) => any
  ): void {
    if (connection != null) {
      return;
    }

    connection = WebSocketService.createSocket(properties);

    connection.onopen = onOpen;
    connection.onmessage = onMessage;
    connection.onclose = onClose;
  }
}
