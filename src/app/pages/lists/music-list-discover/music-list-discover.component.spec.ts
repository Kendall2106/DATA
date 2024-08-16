import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicListDiscoverComponent } from './music-list-discover.component';

describe('MusicListDiscoverComponent', () => {
  let component: MusicListDiscoverComponent;
  let fixture: ComponentFixture<MusicListDiscoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicListDiscoverComponent]
    });
    fixture = TestBed.createComponent(MusicListDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
