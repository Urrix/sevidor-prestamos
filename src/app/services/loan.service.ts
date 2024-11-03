import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:3000/prestamo'; // URL base del servicio de préstamos

  constructor(private http: HttpClient) { }

  // Crea un nuevo préstamo en el servidor
  createLoan(id_cliente: number, monto: number, plazo_meses: number, tasa_interes: number): Observable<any> {
    const loanData = { id_cliente, monto, plazo_meses, tasa_interes };
    return this.http.post(`${this.baseUrl}/create`, loanData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  // Obtiene los préstamos de un cliente específico
  getLoansByClient(id_cliente: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cliente/${id_cliente}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  // Calcula la tabla de amortización para un préstamo dado
  getAmortizationTable(monto: number, plazo_meses: number, tasa_interes: number): any[] {
    const capitalMensual = monto / plazo_meses;
    const amortizationTable = [];
    let saldo = monto;

    for (let i = 1; i <= plazo_meses; i++) {
      const interes = saldo * (tasa_interes / 100) / 12;
      const cuota = capitalMensual + interes;
      saldo -= capitalMensual;

      amortizationTable.push({
        periodo: i,
        cuota: cuota.toFixed(2),
        interes: interes.toFixed(2),
        capital: capitalMensual.toFixed(2),
        saldo: saldo > 0 ? saldo.toFixed(2) : '0.00'
      });
    }
    return amortizationTable;
  }
}
