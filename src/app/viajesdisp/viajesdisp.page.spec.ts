import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajesDispPage } from './viajesdisp.page';

describe('AvailableTripsPage', () => {
  let component: ViajesDispPage;
  let fixture: ComponentFixture<ViajesDispPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesDispPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
