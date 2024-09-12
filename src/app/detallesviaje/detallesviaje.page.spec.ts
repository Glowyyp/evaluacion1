import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesviajePage } from './detallesviaje.page';

describe('DetallesviajePage', () => {
  let component: DetallesviajePage;
  let fixture: ComponentFixture<DetallesviajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesviajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
