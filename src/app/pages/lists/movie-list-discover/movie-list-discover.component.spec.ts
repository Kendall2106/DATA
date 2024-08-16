import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListDiscoverComponent } from './movie-list-discover.component';

describe('MovieListDiscoverComponent', () => {
  let component: MovieListDiscoverComponent;
  let fixture: ComponentFixture<MovieListDiscoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieListDiscoverComponent]
    });
    fixture = TestBed.createComponent(MovieListDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
