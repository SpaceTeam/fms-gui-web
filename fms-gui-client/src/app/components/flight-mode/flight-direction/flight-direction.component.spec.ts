import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDirectionComponent } from './flight-direction.component';

describe('FlightDirectionComponent', () => {
  let component: FlightDirectionComponent;
  let fixture: ComponentFixture<FlightDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
