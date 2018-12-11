import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NavItem} from '../../model/nav-item.model';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  // TODO: Instead of using a JSON, use a YAML or properties file!
  /**
   * The url containing the location of the setting file
   */
  private routesUrl = 'assets/settings/routes.json';

  constructor(
    private http: HttpClient
  ) { }

  public getNavItems(): Observable<NavItem[]> {
    return this.http.get<NavItem[]>(this.routesUrl);
  }
}

