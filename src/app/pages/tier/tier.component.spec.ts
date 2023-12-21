import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierComponent } from './tier.component';

describe('TierComponent', () => {
  let component: TierComponent;
  let fixture: ComponentFixture<TierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TierComponent]
    });
    fixture = TestBed.createComponent(TierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
