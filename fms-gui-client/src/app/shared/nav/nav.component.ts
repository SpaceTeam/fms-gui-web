import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  title = 'Navigation';

  navItems;

  constructor(
    private http: HttpClient
  ) { }

  private loadNavItems(): Observable<any> {
    return this.http.get("../../assets/routes.json");
  }

  ngOnInit() {
    this.loadNavItems()
      .subscribe(navItems => this.navItems = navItems);
  }

}
