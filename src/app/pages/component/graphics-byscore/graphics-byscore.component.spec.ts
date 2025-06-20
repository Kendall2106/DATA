import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsByscoreComponent } from './graphics-byscore.component';

describe('GraphicsByscoreComponent', () => {
  let component: GraphicsByscoreComponent;
  let fixture: ComponentFixture<GraphicsByscoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphicsByscoreComponent]
    });
    fixture = TestBed.createComponent(GraphicsByscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
