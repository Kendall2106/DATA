import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsBytype2Component } from './graphics-bytype2.component';

describe('GraphicsBytype2Component', () => {
  let component: GraphicsBytype2Component;
  let fixture: ComponentFixture<GraphicsBytype2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphicsBytype2Component]
    });
    fixture = TestBed.createComponent(GraphicsBytype2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
