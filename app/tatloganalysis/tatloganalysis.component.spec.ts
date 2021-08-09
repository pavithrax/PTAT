import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TatloganalysisComponent } from './tatloganalysis.component';

describe('TatloganalysisComponent', () => {
  let component: TatloganalysisComponent;
  let fixture: ComponentFixture<TatloganalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TatloganalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TatloganalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
