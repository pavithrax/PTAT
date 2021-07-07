import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadscriptComponent } from './loadscript.component';

describe('LoadscriptComponent', () => {
  let component: LoadscriptComponent;
  let fixture: ComponentFixture<LoadscriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadscriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
