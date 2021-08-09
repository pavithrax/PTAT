import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetHostErrorComponent } from './target-host-error.component';

describe('TargetHostErrorComponent', () => {
  let component: TargetHostErrorComponent;
  let fixture: ComponentFixture<TargetHostErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetHostErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetHostErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
