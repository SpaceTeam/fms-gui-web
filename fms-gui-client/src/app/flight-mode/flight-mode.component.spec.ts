import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModeComponent } from './flight-mode.component';
import {MaterialModule} from '../material.module';

describe('FlightModeComponent', () => {
  let component: FlightModeComponent;
  let fixture: ComponentFixture<FlightModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule],
      declarations: [ FlightModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
