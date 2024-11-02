import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeDetallePage } from './viajedetalle.page';


describe('ViajedetallePage', () => {
  let component: ViajeDetallePage;
  let fixture: ComponentFixture<ViajeDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
