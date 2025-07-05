import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGraphicsComponent } from './game-graphics.component';

describe('GameGraphicsComponent', () => {
  let component: GameGraphicsComponent;
  let fixture: ComponentFixture<GameGraphicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameGraphicsComponent]
    });
    fixture = TestBed.createComponent(GameGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
