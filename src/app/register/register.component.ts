import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  // Inyección de AuthService para gestionar el registro de usuario y FormBuilder para crear el formulario reactivo
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Definición del formulario de registro
  // Se aplican validaciones para los campos obligatorios y requisitos adicionales como mínimo de caracteres en la contraseña
  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    direccion: [''],
    telefono: [''],
    correo: ['', [Validators.required, Validators.email]],
    tipo_usuario: ['cliente', Validators.required],
    nombre_usuario: ['', Validators.required],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Método para registrar un nuevo usuario si el formulario es válido, llamando al servicio de autenticación y gestionando el resultado
  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          console.log("Usuario registrado exitosamente");
          this.router.navigate(['/login']);
        },
        (err) => console.error("Error al registrar el usuario", err)
      );
    }
  }
}
