import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModeComponent } from './flight-mode.component';
import {TestModule} from '../../test.module';

describe('FlightModeComponent', () => {
  let component: FlightModeComponent;
  let fixture: ComponentFixture<FlightModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestModule],
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
