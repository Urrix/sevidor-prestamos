import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  loginForm: FormGroup = this.fb.group({
    nombre_usuario: ['', Validators.required],
    contrasena: ['', Validators.required],
  });

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (res: any) => {
          this.authService.setToken(res.token);
          console.log("Inicio de sesión exitoso");
        },
        (err) => console.error("Error en el inicio de sesión", err)
      );
    }
  }
}
