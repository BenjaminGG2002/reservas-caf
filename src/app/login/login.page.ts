import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }
  
    if (this.email === 'brai.gonzalez@duocuc.cl' && this.username === 'Braihan Gonzalez' && this.password === '200230') {
      this.router.navigate(['/inicio'], { queryParams: { username: this.username, email: this.email } });
    } else {
      alert('Datos incorrectos');
    }
  }
  
}


