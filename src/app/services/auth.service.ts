import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible de forma global en toda la aplicación
})
export class AuthService {
  // Observables para compartir el estado de autenticación entre componentes
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private baseUrl = 'http://localhost:3000/usuario';

  // Inicializa HttpClient y Router para manejar las peticiones HTTP y la navegación
  constructor(private http: HttpClient, private router: Router) {
    const userId = this.getUserId();
    if (userId) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Método para iniciar sesión con el nombre de usuario y la contraseña
  login(nombre_usuario: string, contrasena: string): Observable<boolean> {
    const loginEndpoint = `${this.baseUrl}/login`;

    return this.http
      .post<{ name: string; userId: string; role: string }>(loginEndpoint, {
        nombre_usuario,
        contrasena,
      })
      .pipe(
        // Almacena los datos del usuario en localStorage si el inicio de sesión es exitoso
        tap((response) => {
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('role', response.role);
          this.isAuthenticatedSubject.next(true); // Actualiza el estado de autenticación
        }),
        map(() => true),
        catchError((error) => {
          this.isAuthenticatedSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  // Método para cerrar sesión: limpia los datos de autenticación y redirige al usuario al login
  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Obtiene el rol del usuario actual desde localStorage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Obtiene el nombre del usuario actual desde localStorage
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  // Obtiene el ID del usuario actual desde localStorage
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      catchError((error) => {
        console.error('Error al registrar el usuario:', error);
        return throwError(() => error);
      })
    );
  }
}
