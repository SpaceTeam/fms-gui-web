import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampBrushComponent } from './timestamp-brush.component';

describe('TimestampBrushComponent', () => {
  let component: TimestampBrushComponent;
  let fixture: ComponentFixture<TimestampBrushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimestampBrushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
