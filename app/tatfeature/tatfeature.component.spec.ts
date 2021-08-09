import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TatfeatureComponent } from './tatfeature.component';

describe('TatfeatureComponent', () => {
  let component: TatfeatureComponent;
  let fixture: ComponentFixture<TatfeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TatfeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TatfeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
