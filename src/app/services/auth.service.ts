import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private baseUrl = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient, private router: Router) {
    const userId = this.getUserId();
    if (userId) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(nombre_usuario: string, contrasena: string): Observable<boolean> {
    const loginEndpoint = `${this.baseUrl}/login`;

    return this.http
      .post<{ name: string; userId: string; role: string }>(loginEndpoint, {
        nombre_usuario,
        contrasena,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('role', response.role);
          this.isAuthenticatedSubject.next(true);
        }),
        map(() => true),
        catchError((error) => {
          this.isAuthenticatedSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  obtenerMisPrestamos(id_cliente: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/prestamos/${id_cliente}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  solicitarPrestamo(prestamoData: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/solicitar-prestamo`, prestamoData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      catchError((error) => {
        console.error('Error al registrar el usuario:', error);
        return throwError(() => error);
      })
    );
  }
}
