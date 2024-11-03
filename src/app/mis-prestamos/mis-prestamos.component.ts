import { Component, OnInit } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { AuthService } from '../services/auth.service';

interface AmortizationRow {
  periodo: number;
  cuota: number;
  interes: number;
  capital: number;
  saldo: number;
}

@Component({
  selector: 'app-mis-prestamos',
  templateUrl: './mis-prestamos.component.html',
  styleUrls: ['./mis-prestamos.component.sass']
})
export class MisPrestamosComponent implements OnInit {
  amortizacionTable: any[] = []; // Tabla de amortización del préstamo seleccionado
  prestamos: any[] = []; // Lista de préstamos del cliente
  mensajeSinPrestamos = 'Aún no tiene préstamos'; // Mensaje si no hay préstamos
  idCliente: string | null = null; // ID del cliente autenticado

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) { }

  // Obtiene el ID del cliente y carga los préstamos al iniciar el componente
  ngOnInit(): void {
    this.idCliente = this.authService.getUserId();
    this.cargarPrestamos();
  }

  // Carga los préstamos del cliente desde el servicio
  cargarPrestamos() {
    const id_cliente = this.authService.getUserId();
    if (!id_cliente) return;

    this.loanService.getLoansByClient(parseInt(id_cliente)).subscribe({
      next: (data) => {
        this.prestamos = data;
      },
      error: (error) => {
        console.error("Error al cargar los préstamos", error);
      },
    });
  }

  // Genera la tabla de amortización para un préstamo específico
  verAmortizacion(prestamo: any) {
    const { monto, plazo_meses, tasa_interes } = prestamo;
    this.amortizacionTable = this.loanService.getAmortizationTable(monto, plazo_meses, tasa_interes);
  }
}
