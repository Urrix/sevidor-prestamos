import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarPrestamoComponent } from './solicitar-prestamo.component';

describe('SolicitarPrestamoComponent', () => {
  let component: SolicitarPrestamoComponent;
  let fixture: ComponentFixture<SolicitarPrestamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolicitarPrestamoComponent]
    });
    fixture = TestBed.createComponent(SolicitarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
