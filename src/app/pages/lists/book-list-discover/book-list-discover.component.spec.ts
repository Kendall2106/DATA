import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListDiscoverComponent } from './book-list-discover.component';

describe('BookListDiscoverComponent', () => {
  let component: BookListDiscoverComponent;
  let fixture: ComponentFixture<BookListDiscoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookListDiscoverComponent]
    });
    fixture = TestBed.createComponent(BookListDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
