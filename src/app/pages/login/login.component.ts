import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const credenciales = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/users/login', credenciales)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('usuario', JSON.stringify(res));

          Swal.fire({
            icon: 'success',
            title: '¡Login exitoso!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/chats']);
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: err.error?.error || 'Credenciales incorrectas',
          });
        }
      });
  }
}
