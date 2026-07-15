import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlbumsComponent } from './modal-albums.component';

describe('ModalAlbumsComponent', () => {
  let component: ModalAlbumsComponent;
  let fixture: ComponentFixture<ModalAlbumsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAlbumsComponent]
    });
    fixture = TestBed.createComponent(ModalAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
