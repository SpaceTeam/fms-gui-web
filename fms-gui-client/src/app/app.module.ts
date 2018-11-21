import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NavComponent} from "./nav/nav.component";
import {FlightmodeComponent} from "./flightmode/flightmode.component";
import {MainComponent} from "./main/main.component";
import {StatuspanelComponent} from "./statuspanel/statuspanel.component";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FlightmodeComponent,
    StatuspanelComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
