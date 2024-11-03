import { Component, OnInit } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mis-prestamos',
  templateUrl: './mis-prestamos.component.html',
  styleUrls: ['./mis-prestamos.component.sass']
})
export class MisPrestamosComponent implements OnInit {
  prestamos: any[] = [];
  mensajeSinPrestamos = 'Aún no tiene préstamos';
  idCliente: string | null = null;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.idCliente = this.authService.getUserId();
    this.cargarPrestamos();
  }

  cargarPrestamos() {
    if (!this.idCliente) return;

    this.loanService.getLoansByClient(parseInt(this.idCliente)).subscribe({
      next: (data) => {
        this.prestamos = data;
      },
      error: (error) => {
        console.error("Error al cargar los préstamos", error);
      },
    });
  }
}
