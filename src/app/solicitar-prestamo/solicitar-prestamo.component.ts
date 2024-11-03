import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-solicitar-prestamo',
  templateUrl: './solicitar-prestamo.component.html',
  styleUrls: ['./solicitar-prestamo.component.sass']
})
export class SolicitarPrestamoComponent implements OnInit {
  prestamoForm: FormGroup;
  prestamos: any[] = [];
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() {
    this.prestamoForm = this.fb.group({
      monto: [0, [Validators.required, Validators.min(1)]],
      plazo_meses: [0, [Validators.required, Validators.min(1)]],
      tasa_interes: [0, [Validators.required, Validators.min(0.1), Validators.max(100)]],
    });
  }

  ngOnInit() {
    this.cargarPrestamos();
  }

  cargarPrestamos() {
    const id_cliente = this.authService.getUserId();
    if (!id_cliente) return;

    this.authService.obtenerMisPrestamos(id_cliente).subscribe({
      next: (data) => (this.prestamos = data),
      error: (error) => console.error("Error al cargar los préstamos", error),
    });
  }

  solicitarPrestamo() {
    const id_cliente = this.authService.getUserId();
    if (!id_cliente) return;

    const prestamoData = { id_cliente, ...this.prestamoForm.value };
    this.authService.solicitarPrestamo(prestamoData).subscribe({
      next: () => {
        console.log("Préstamo solicitado con éxito");
        this.cargarPrestamos();
      },
      error: (err) => console.error("Error al solicitar el préstamo", err),
    });
  }
}
