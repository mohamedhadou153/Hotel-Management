import { ComponentFixture, TestBed } from '@angular/core/testing';

import { reservationComponent } from './reservation.component';

describe('reservationComponent', () => {
  let component: reservationComponent;
  let fixture: ComponentFixture<reservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ reservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(reservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
