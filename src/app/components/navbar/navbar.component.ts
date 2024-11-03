import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  // Variables para almacenar el estado de autenticación y los datos del usuario
  isAuthenticated: boolean = false;
  userName: string | null = null;
  userRole: string | null = null;

  // Inyección del servicio de autenticación
  constructor(private authService: AuthService) { }

  // Inicializa el componente y suscribe a los cambios en el estado de autenticación
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.userName = this.authService.getUserName(); // Obtiene el nombre del usuario
      this.userRole = this.authService.getRole();     // Obtiene el rol del usuario
    });
  }

  logout() {
    this.authService.logout();
  }
}
