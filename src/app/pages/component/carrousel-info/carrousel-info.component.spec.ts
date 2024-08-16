import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselInfoComponent } from './carrousel-info.component';

describe('CarrouselInfoComponent', () => {
  let component: CarrouselInfoComponent;
  let fixture: ComponentFixture<CarrouselInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarrouselInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
