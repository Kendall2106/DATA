import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNextComponent } from './list-next.component';

describe('ListNextComponent', () => {
  let component: ListNextComponent;
  let fixture: ComponentFixture<ListNextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListNextComponent]
    });
    fixture = TestBed.createComponent(ListNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
