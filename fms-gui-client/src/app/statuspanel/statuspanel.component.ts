import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statuspanel',
  templateUrl: './statuspanel.component.html',
  styleUrls: ['./statuspanel.component.scss']
})
export class StatuspanelComponent implements OnInit {
  title = "Status Panel";

  constructor() { }

  ngOnInit() {
  }

}
