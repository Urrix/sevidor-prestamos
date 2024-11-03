import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-solicitar-prestamo',
  templateUrl: './solicitar-prestamo.component.html',
  styleUrls: ['./solicitar-prestamo.component.sass']
})
export class SolicitarPrestamoComponent {
  prestamoForm: FormGroup; // Formulario para capturar datos del préstamo
  amortizacionTable: any[] = []; // Tabla de amortización calculada

  private loanService = inject(LoanService);
  private fb = inject(FormBuilder);

  constructor() {
    // Inicializa el formulario de préstamo con validaciones
    this.prestamoForm = this.fb.group({
      id_cliente: ['', [Validators.required]],
      monto: [0, [Validators.required, Validators.min(1)]],
      plazo_meses: [0, [Validators.required, Validators.min(1)]],
      tasa_interes: [0, [Validators.required, Validators.min(0.1), Validators.max(100)]],
    });

    // Calcula la amortización automáticamente al cambiar valores del formulario
    this.prestamoForm.valueChanges.subscribe(() => {
      this.calcularAmortizacion();
    });
  }

  // Solicita un nuevo préstamo usando los datos del formulario
  solicitarPrestamo() {
    const { id_cliente, monto, plazo_meses, tasa_interes } = this.prestamoForm.value;

    this.loanService.createLoan(id_cliente, monto, plazo_meses, tasa_interes).subscribe({
      next: () => {
        console.log("Préstamo solicitado con éxito");
        this.resetForm(); // Reinicia el formulario y la tabla de amortización
      },
      error: (err) => console.error("Error al solicitar el préstamo", err),
    });
  }

  // Calcula la tabla de amortización para el préstamo
  calcularAmortizacion() {
    const monto = this.prestamoForm.value.monto;
    const plazo_meses = this.prestamoForm.value.plazo_meses;
    const tasa_interes = this.prestamoForm.value.tasa_interes / 100;

    if (monto > 0 && plazo_meses > 0 && tasa_interes > 0) {
      const capitalMensual = monto / plazo_meses;
      this.amortizacionTable = [];
      let saldo = monto;

      for (let i = 1; i <= plazo_meses; i++) {
        const interes = saldo * tasa_interes / 12;
        const cuota = capitalMensual + interes;
        saldo -= capitalMensual;

        this.amortizacionTable.push({
          periodo: i,
          cuota: cuota.toFixed(2),
          interes: interes.toFixed(2),
          capital: capitalMensual.toFixed(2),
          saldo: saldo > 0 ? saldo.toFixed(2) : '0.00'
        });
      }
    } else {
      this.amortizacionTable = [];
    }
  }

  // Reinicia el formulario y limpia la tabla de amortización
  resetForm() {
    this.prestamoForm.reset({
      id_cliente: '',
      monto: 0,
      plazo_meses: 0,
      tasa_interes: 0,
    });
    this.amortizacionTable = [];
  }
}
