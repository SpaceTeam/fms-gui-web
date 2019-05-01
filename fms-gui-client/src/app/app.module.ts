import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {FlightModeComponent} from './flight-mode/flight-mode.component';
import {MainComponent} from './main/main.component';
import {StatusPanelComponent} from './status-panel/status-panel.component';
import {ControlsComponent} from './controls/controls.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CardsComponent} from './cards/cards.component';
import {LoadingComponent} from './loading/loading.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    NavComponent,
    FlightModeComponent,
    StatusPanelComponent,
    MainComponent,
    ControlsComponent,
    PageNotFoundComponent,
    CardsComponent,
    LoadingComponent,
    LoadingComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
