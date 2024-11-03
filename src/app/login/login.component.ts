import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  // Inyección de dependencias para autenticación, formularios y navegación
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Definición y validación del formulario de inicio de sesión
  loginForm: FormGroup = this.fb.group({
    nombre_usuario: ['', Validators.required],
    contrasena: ['', Validators.required],
  });

  // Método para manejar el inicio de sesión del usuario
  login() {
    if (this.loginForm.valid) {
      // Llama al servicio de autenticación
      this.authService.login(
        this.loginForm.value.nombre_usuario,
        this.loginForm.value.contrasena
      ).subscribe(
        () => {
          console.log("Inicio de sesión exitoso");
          this.router.navigate(['/home']);
        },
        (err) => console.error("Error en el inicio de sesión", err)
      );
    }
  }
}
