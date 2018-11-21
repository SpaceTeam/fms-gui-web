import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspanelComponent } from './statuspanel.component';

describe('StatuspanelComponent', () => {
  let component: StatuspanelComponent;
  let fixture: ComponentFixture<StatuspanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatuspanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatuspanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
