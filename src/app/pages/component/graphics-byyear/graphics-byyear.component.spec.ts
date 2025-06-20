import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsByyearComponent } from './graphics-byyear.component';

describe('GraphicsByyearComponent', () => {
  let component: GraphicsByyearComponent;
  let fixture: ComponentFixture<GraphicsByyearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphicsByyearComponent]
    });
    fixture = TestBed.createComponent(GraphicsByyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
