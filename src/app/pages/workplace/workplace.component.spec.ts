import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceComponent } from './workplace.component';

describe('WorkplaceComponent', () => {
  let component: WorkplaceComponent;
  let fixture: ComponentFixture<WorkplaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkplaceComponent]
    });
    fixture = TestBed.createComponent(WorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
