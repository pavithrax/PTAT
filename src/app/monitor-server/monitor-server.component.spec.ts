import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorServerComponent } from './monitor-server.component';

describe('MonitorServerComponent', () => {
  let component: MonitorServerComponent;
  let fixture: ComponentFixture<MonitorServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
