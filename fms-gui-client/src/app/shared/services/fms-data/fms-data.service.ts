import { Injectable } from '@angular/core';
import { FMSData } from '../../model/fms-data/fms-data.model';
import { Observable, of } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

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

  // TODO: Save the url in a properties / YAML file
  // TODO: Change this url as soon as we have a server to contact!
  /**
   * Contains the url of the server where we can get the json file
   * TODO: Change from 'assets' to the server's url, containing the files
   */
  url = 'assets';

  /**
   * Contains the url of the json
   */
  jsonUrl = '/mocks/mock.fms.json';

  /**
   * Contains the url of the schema
   * TODO: Create a JSON schema for the FMS JSON files
   */
  schemaUrl = '';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Retrieves a FMS JSON from the server and returns it to the client
   * TODO: Change this to be more dynamic -> instead of creating an FMSData object,
   * get the simple JSON => We need this for e.g. making dynamic cards possible
   * @return returns an observable of an FMS object
   */
  getData(): Observable<FMSData> {
    const d = new Date();
    return this.http.get<FMSData>(this.url + this.jsonUrl)
      .pipe(
        // TODO: Save this to a log file
        // tap(() => console.log(`Fetched FMSData at ${d.toLocaleTimeString('de', optionsTime)}`)),
        catchError(this.handleError<FMSData>(`get fms data at ${d.toLocaleTimeString('de', optionsTime)}`))
      );
  }

  /**
   * TODO: Implement the same for numbers, boolean and dates
   * Returns the string referenced by the key
   * @param key e.g. "orientation_of_fms"
   * @return the value e.g. "Y_PLUS"
   */
  getString(key: string): string {
    // TODO: Implement me
    return null;
  }

  private validateJSON(json): boolean {
    // TODO: Implement the JSON validation => get the JSON schema and validate it
    return false;
  }

  /**
   * Handles the error we can get, if an operation failed
   * @param operation the operation which failed
   * @param result the result of the operation
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
