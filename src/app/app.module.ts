import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitarPrestamoComponent } from './solicitar-prestamo/solicitar-prestamo.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MisPrestamosComponent } from './mis-prestamos/mis-prestamos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SolicitarPrestamoComponent,
    NavbarComponent,
    RegisterComponent,
    HomeComponent,
    MisPrestamosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
