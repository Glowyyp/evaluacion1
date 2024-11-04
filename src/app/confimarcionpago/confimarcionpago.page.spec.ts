import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionPagoPage } from './confimarcionpago.page';

describe('ConfimarcionpagoPage', () => {
  let component: ConfirmacionPagoPage;
  let fixture: ComponentFixture<ConfirmacionPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
