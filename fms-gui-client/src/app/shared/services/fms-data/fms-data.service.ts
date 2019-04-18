import { Injectable } from '@angular/core';
import { FMSData } from '../../model/old-fms-data/fms-data.model';
import {WebSocketService} from '../web-socket/web-socket.service';
import {environment as env} from '../../../../environments/environment';
import {Logger} from '../logger/logger.service';
import {Observable} from 'rxjs';

/**
 * This service class gets the data from an FMS end point and provides functions for that data
 */
@Injectable({
  providedIn: 'root'
})
export class FmsDataService {

  /**
   * The connection to the WebSocket
   */
  private connection: WebSocket = null;

  /**
   * The global FMSData
   */
  private fms: FMSData;

  present: Observable<boolean> = Observable.create(observer => setInterval(() => observer.next(this.hasFMSData), 1000));

  constructor() {
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

  private hasFMSData(): boolean {
    console.dir(this.fms);
    return this.fms !== null && this.fms !== undefined;
  }

  public getFMSData(): FMSData {
    return this.fms;
  }

  /**
   * This method defines what should happen on the client as soon as the WebSocket connection is established
   * @param event
   */
  private onOpen(this: WebSocket, event: Event): any {
    Logger.log('WebSocket open');
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param event
   */
  private onMessage(event: MessageEvent): any {
    this.fms = JSON.parse(event.data);
  }

  /**
   * This method defines what should happen on the client as soon as the WebSocket connection is closed
   * @param event
   */
  private onClose(this: WebSocket, event: CloseEvent): any {
    Logger.log('WebSocket close');
    this.close();
  }
}
