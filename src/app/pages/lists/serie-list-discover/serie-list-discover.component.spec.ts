import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieListDiscoverComponent } from './serie-list-discover.component';

describe('SerieListDiscoverComponent', () => {
  let component: SerieListDiscoverComponent;
  let fixture: ComponentFixture<SerieListDiscoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerieListDiscoverComponent]
    });
    fixture = TestBed.createComponent(SerieListDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
