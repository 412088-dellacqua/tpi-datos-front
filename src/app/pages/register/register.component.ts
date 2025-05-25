import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient,private router: Router) {}

  registrarse() {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Las contraseñas no coinciden',
      });
      return;
    }

    const nuevoUsuario = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/users', nuevoUsuario)
      .subscribe({
        next: (res) => {
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
          console.error('Error al registrar', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: err.error?.error || 'Hubo un error desconocido',
          });
        }
      });
  }
}
