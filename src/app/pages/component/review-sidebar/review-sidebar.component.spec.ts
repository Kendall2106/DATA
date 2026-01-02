import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSidebarComponent } from './review-sidebar.component';

describe('ReviewSidebarComponent', () => {
  let component: ReviewSidebarComponent;
  let fixture: ComponentFixture<ReviewSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewSidebarComponent]
    });
    fixture = TestBed.createComponent(ReviewSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
