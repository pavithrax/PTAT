import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoralertstreeComponent } from './monitoralertstree.component';

describe('MonitoralertstreeComponent', () => {
  let component: MonitoralertstreeComponent;
  let fixture: ComponentFixture<MonitoralertstreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoralertstreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoralertstreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
