import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:3000/prestamo';

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo préstamo
  createLoan(id_cliente: number, monto: number, plazo_meses: number, tasa_interes: number): Observable<any> {
    const loanData = { id_cliente, monto, plazo_meses, tasa_interes };
    return this.http.post(`${this.baseUrl}/create`, loanData);
  }

  // Método para obtener todos los préstamos de un cliente
  getLoansByClient(id_cliente: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cliente/${id_cliente}`);
  }

  // Método para obtener un préstamo específico de un cliente
  getLoanById(id_cliente: number, id_prestamo: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id_cliente}/${id_prestamo}`);
  }

  // Método para actualizar el estado de un préstamo
  updateLoanStatus(id_cliente: number, id_prestamo: number, estado: string): Observable<any> {
    const updateData = { estado };
    return this.http.put(`${this.baseUrl}/${id_cliente}/prestamo/${id_prestamo}/estado`, updateData);
  }
}
