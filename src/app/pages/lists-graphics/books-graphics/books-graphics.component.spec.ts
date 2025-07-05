import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksGraphicsComponent } from './books-graphics.component';

describe('BooksGraphicsComponent', () => {
  let component: BooksGraphicsComponent;
  let fixture: ComponentFixture<BooksGraphicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksGraphicsComponent]
    });
    fixture = TestBed.createComponent(BooksGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
