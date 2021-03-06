import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NavItem} from '../../model/nav-item.model';

/**
 * This service class gets the data from the routes setting file, for adding nav items dynamically
 */
@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  /**
   * The url containing the location of the setting file
   */
  private routesUrl = 'assets/settings/routes.json';

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Gets the route elements from the given url
   * @return an observable array of {@link NavItem} elements
   */
  public getNavItems(): Observable<NavItem[]> {
    return this.http.get<NavItem[]>(this.routesUrl);
  }
}

