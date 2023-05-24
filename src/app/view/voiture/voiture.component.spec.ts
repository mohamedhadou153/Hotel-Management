import { ComponentFixture, TestBed } from '@angular/core/testing';

import { voitureComponent } from './voiture.component';

describe('voitureComponent', () => {
  let component: voitureComponent;
  let fixture: ComponentFixture<voitureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ voitureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(voitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
