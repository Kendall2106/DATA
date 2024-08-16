import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListDiscoverComponent } from './game-list-discover.component';

describe('GameListDiscoverComponent', () => {
  let component: GameListDiscoverComponent;
  let fixture: ComponentFixture<GameListDiscoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameListDiscoverComponent]
    });
    fixture = TestBed.createComponent(GameListDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
