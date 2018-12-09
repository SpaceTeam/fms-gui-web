import { Injectable } from '@angular/core';
import { FMSData } from '../../model/fms-data.model';
import { Observable, of } from 'rxjs';
import {mockFMS} from '../../../../assets/mock-fms';

// TODO: Save the url in a properties / yaml file
// Contains the url of the server where we can get the json file
const url = '';

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

  constructor(
  ) { }

  /**
   * Retrieves a FMS JSON from the server and returns it to the client
   */
  getData(): Observable<FMSData> {
    // const d = new Date();
    return of(mockFMS);
    // TODO: Uncomment the next code as soon as retrieving data from server works
    /*
    return this.http.get<FMSData>(url)
      .pipe(
        tap(() => console.log(`Fetched FMSData at ${d.toLocaleTimeString('de', optionsTime)}`)),
        catchError(this.handleError<FMSData>(`get fms data at ${d.toLocaleTimeString('de', optionsTime)}`))
      );
    */
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
