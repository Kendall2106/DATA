import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeListDiscoverComponent } from './anime-list-discover.component';

describe('AnimeListDiscoverComponent', () => {
  let component: AnimeListDiscoverComponent;
  let fixture: ComponentFixture<AnimeListDiscoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimeListDiscoverComponent]
    });
    fixture = TestBed.createComponent(AnimeListDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
