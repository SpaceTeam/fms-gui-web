import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NavComponent} from './shared/nav/nav.component';
import {FlightmodeComponent} from './flightmode/flightmode.component';
import {MainComponent} from './main/main.component';
import {StatuspanelComponent} from './statuspanel/statuspanel.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {HttpClientModule} from '@angular/common/http';
import {ReplaceUnderscorePipe} from './shared/pipes/replace-underscore.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FlightmodeComponent,
    StatuspanelComponent,
    MainComponent,
    ReplaceUnderscorePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
