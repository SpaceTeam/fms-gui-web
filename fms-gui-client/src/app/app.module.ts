import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NavComponent} from './shared/nav/nav.component';
import {FlightmodeComponent} from './flightmode/flightmode.component';
import {MainComponent} from './main/main.component';
import {StatuspanelComponent} from './statuspanel/statuspanel.component';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "./material.module";

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
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule
    // HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
