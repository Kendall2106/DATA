import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeGraphicsComponent } from './anime-graphics.component';

describe('AnimeGraphicsComponent', () => {
  let component: AnimeGraphicsComponent;
  let fixture: ComponentFixture<AnimeGraphicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimeGraphicsComponent]
    });
    fixture = TestBed.createComponent(AnimeGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
