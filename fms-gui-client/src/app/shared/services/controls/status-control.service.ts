import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NavItem} from '../../model/nav-item.model';
import {StatusControl} from '../../model/status-control.model';

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class StatusControlService {

  // TODO: Instead of using a JSON, use a YAML or properties file!
  /**
   * The url containing the location of the setting file
   */
  private url = 'assets/controls/status-controls.json';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Gets the control elements from the given url
   * @return an observable array of {@link StatusControl} elements
   */
  public getStatusControls(): Observable<StatusControl[]> {
    return this.http.get<StatusControl[]>(this.url);
  }
}

