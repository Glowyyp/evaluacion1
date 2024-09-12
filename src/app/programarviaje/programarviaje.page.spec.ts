import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramarViajePage } from './programarviaje.page';

describe('ProgramarviajePage', () => {
  let component: ProgramarViajePage;
  let fixture: ComponentFixture<ProgramarViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
