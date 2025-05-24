// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  registrar(nuevoUsuario: any): void {
    this.http.post(`${this.apiUrl}`, nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado', res);
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Ya podés iniciar sesión',
          confirmButtonText: 'OK'
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

  login(credenciales: any): void {
    this.http.post(`${this.apiUrl}/login`, credenciales).subscribe({
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
