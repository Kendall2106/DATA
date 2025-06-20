import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsBytypeComponent } from './graphics-bytype.component';

describe('GraphicsBytypeComponent', () => {
  let component: GraphicsBytypeComponent;
  let fixture: ComponentFixture<GraphicsBytypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphicsBytypeComponent]
    });
    fixture = TestBed.createComponent(GraphicsBytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
