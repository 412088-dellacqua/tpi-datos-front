import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  vistaActual: string = 'dashboard';
  usuarios: any[] = [];

  private http = inject(HttpClient);

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    if (vista === 'usuarios') {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios() {
    console.log('Cargando usuarios...');
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }
}
