import { Injectable } from '@angular/core';
import {WebSocketService} from '../web-socket/web-socket.service';
import {BehaviorSubject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/webSocket';
import {ServerProperties} from '../../properties/server.properties';
import {NameValuePair} from '../../model/name-value-pair.model';
import {DuplicateEntryException} from '../../exceptions/json/duplicate-entry.exception';
import {NoSuchEntryException} from '../../exceptions/json/no-such-entry.exception';
import {Logger} from '../../logger/logger';

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
  private static readonly webSocketSubject: WebSocketSubject<Array<NameValuePair>>;

  /**
   * The global FMSData
   * accessible via {@link FmsDataService.getFMSData}
   */
  private static fms: Array<NameValuePair>;

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
    WebSocketService.connectWebSocket(FmsDataService.webSocketSubject, ServerProperties.SERVER_PROPERTIES, FmsDataService.onMessage);
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
  public getFMSData(): Array<NameValuePair> {
    return FmsDataService.fms;
  }

  /**
   * Returns the value to a given path
   * @param path to a variable
   * @param subtree for only processing a given subtree
   * @use get("status/flags") returns an array
   */
  public getValue(path: string): string | number | boolean | Array<NameValuePair> {
    return FmsDataService.getValueFromSubtree(path, FmsDataService.fms);
  }

  private static getValueFromSubtree(path: string, subtree: Array<NameValuePair>): string | number | boolean | Array<NameValuePair> {

    // 1) Split the path
    let arr: string[] = path.split("/");

    // 2) Find the next element, e.g. 'Flags'
    let next = arr.shift();

    // 3) Get the subtree with the given path
    // e.g. next = "Flags" should return the array with "Flags"
    subtree = subtree.filter(pair => {
      if(next.toLowerCase() === pair.name.toLowerCase()) {
        return pair;
      }
    });

    // 4) If the subtree is empty, then there is no element with the given path
    if(subtree.length === 0) {
      Logger.error(`There is no ${next} in ${subtree}`);
      //throw new NoSuchEntryException(`There is no ${next} in ${subtree}`);
      return null;
    }

    // 5) If the subtree still has more than one element, then we have duplicate entries
    if (subtree.length > 1) {
      Logger.error(`Duplicate entry ${path}`);
      //throw new DuplicateEntryException(`Duplicate entry ${path}`);
      return null;
    }

    // 6) Check, if we're in the last level -> there should be no element in the path anymore
    if(arr.length === 0) {
      return subtree[0].value;
    }
    // 7) Else we have to find the next level and pass it as a parameter
    else {
      // Concatenate the remaining string and traverse the new subtree with it
      return FmsDataService.getValueFromSubtree(arr.join("/"), <Array<NameValuePair>>subtree[0].value);
    }
  }

  /**
   * This method defines what should happen as soon as the client receives a message
   * @param msg the actual fms data
   */
  private static onMessage(msg: Array<NameValuePair>): any {
    // Parse the received message to a FMS object
    FmsDataService.fms = msg;

    // Send to all subscribers, that there is a new FMS object
    FmsDataService.presentSubject.next(FmsDataService.hasFMSData());
  }
}
