import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  username: string = '';
  email: string = '';

  constructor(private router: Router) {}

  recuperar() {
    // Validación de formato de correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }

    // Simulación de la recuperación de contraseña
    if (this.username === 'Braihan Gonzalez' && this.email === 'brai.gonzalez@duocuc.cl') {
      alert('Se ha enviado un correo de recuperación a ' + this.email);
      this.router.navigate(['/login']);
    } else {
      alert('Nombre de usuario o correo electrónico incorrectos.');
    }
  }
}

