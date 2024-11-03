import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    direccion: [''],
    telefono: [''],
    correo: ['', [Validators.required, Validators.email]],
    tipo_usuario: ['cliente', Validators.required],
    nombre_usuario: ['', Validators.required],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        () => console.log("Usuario registrado exitosamente"),
        (err) => console.error("Error al registrar el usuario", err)
      );
    }
  }
}
