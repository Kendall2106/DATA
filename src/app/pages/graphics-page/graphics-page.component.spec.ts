import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsPageComponent } from './graphics-page.component';

describe('GraphicsPageComponent', () => {
  let component: GraphicsPageComponent;
  let fixture: ComponentFixture<GraphicsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphicsPageComponent]
    });
    fixture = TestBed.createComponent(GraphicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
