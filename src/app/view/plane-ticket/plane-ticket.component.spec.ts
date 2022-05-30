import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneTicketComponent } from './plane-ticket.component';

describe('PlaneTicketComponent', () => {
  let component: PlaneTicketComponent;
  let fixture: ComponentFixture<PlaneTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaneTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaneTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
