import { Injectable } from '@angular/core';
import { FMSData } from '../../model/old-fms-data/fms-data.model';
import {WebSocketService} from '../web-socket/web-socket.service';
import {environment as env} from '../../../../environments/environment';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {WebSocketSubject} from 'rxjs/webSocket';

/**
 * This service class gets the data from an FMS end point and provides functions for that data
 */
@Injectable({
  providedIn: 'root'
})
export class FmsDataService {

  /**
   * The websocket connection to the server
   */
  private static readonly webSocketSubject: WebSocketSubject<FMSData>;

  /**
   * The server's properties, which will be converted into a URL
   */
  private static readonly webSocketProperties: WebSocketProperties = {
    host: env.server.host,
    port: env.server.port,
    path: env.server.subscribe,
    secure: env.server.secure
  };

  /**
   * The global FMSData
   * accessible via {@link FmsDataService.getFMSData}
   */
  private static fms: FMSData;

  /**
   * A subject which can be subscribed to for telling, if any FMS data are present
   */
  private static presentSubject = new BehaviorSubject<boolean>(false);

  /**
   * The global indicator for telling, if the FMS data is present
   *
   */
  public isFMSDataPresent: boolean;

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    // Open a websocket to the server, which will last over the whole application
    WebSocketService.connectWebSocket(FmsDataService.webSocketSubject, FmsDataService.webSocketProperties, FmsDataService.onMessage);
    FmsDataService.presentSubject.asObservable().subscribe(bool => this.isFMSDataPresent = bool);
  }

  /**
   * Checks if we have any FMS data locally
   */
  private static hasFMSData(): boolean {
    return FmsDataService.fms !== null && FmsDataService.fms !== undefined;
  }

  /**
   * Returns the actual FMS data
   */
  public getFMSData(): FMSData {
    return FmsDataService.fms;
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual fms data
   */
  private static onMessage(msg: FMSData): any {
    // Parse the received message to a FMS object
    FmsDataService.fms = msg;

    // Send to all subscribers, that there is a new FMS object
    FmsDataService.presentSubject.next(FmsDataService.hasFMSData());
  }
}
