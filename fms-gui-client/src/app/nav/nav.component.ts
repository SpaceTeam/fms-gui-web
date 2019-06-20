import {Component, OnInit} from '@angular/core';
import {RoutesService} from '../shared/services/routes/routes.service';
import {NavItem} from '../shared/model/nav-item.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  /**
   * This array will contain every navigable page as a link
   */
  navItems: NavItem[];

  constructor(private routesService: RoutesService) {

  }

  ngOnInit() {
    this.routesService.getNavItems()
      .subscribe(navItems => this.navItems = navItems);
  }

}
