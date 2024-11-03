import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:3000/prestamo';

  constructor(private http: HttpClient) { }

  // Crea un nuevo préstamo
  createLoan(id_cliente: number, monto: number, plazo_meses: number, tasa_interes: number): Observable<any> {
    const loanData = { id_cliente, monto, plazo_meses, tasa_interes };
    return this.http.post(`${this.baseUrl}/create`, loanData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  // Obtiene los préstamos de un cliente
  getLoansByClient(id_cliente: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cliente/${id_cliente}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  // Obtiene un préstamo específico por ID
  getLoanById(id_cliente: number, id_prestamo: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id_cliente}/${id_prestamo}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  // Actualiza el estado de un préstamo
  updateLoanStatus(id_cliente: number, id_prestamo: number, estado: string): Observable<any> {
    const updateData = { estado };
    return this.http.put(`${this.baseUrl}/${id_cliente}/prestamo/${id_prestamo}/estado`, updateData)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
