import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavescriptComponent } from './savescript.component';

describe('SavescriptComponent', () => {
  let component: SavescriptComponent;
  let fixture: ComponentFixture<SavescriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavescriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavescriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
