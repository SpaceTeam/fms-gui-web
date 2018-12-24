import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Control} from '../../model/control.model';

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class ControlService {

  // TODO: Instead of using a JSON, use a YAML or properties file!
  /**
   * The url containing the location of the setting file
   */
  private url = 'assets/controls/statuspanel.controls.json';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Gets the control elements from the given url
   * @return an observable array of {@link Control} elements
   */
  public getControls(): Observable<Control[]> {
    return this.http.get<Control[]>(this.url);
  }
}

