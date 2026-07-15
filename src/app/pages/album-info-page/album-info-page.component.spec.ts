import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumInfoPageComponent } from './album-info-page.component';

describe('AlbumInfoPageComponent', () => {
  let component: AlbumInfoPageComponent;
  let fixture: ComponentFixture<AlbumInfoPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumInfoPageComponent]
    });
    fixture = TestBed.createComponent(AlbumInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
