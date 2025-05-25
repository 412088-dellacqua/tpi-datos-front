import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bottom-floating',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './bottom-floating.component.html',
})
export class BottomFloatingComponent {
  showPopup = false;
  busqueda = '';
  resultados: any[] = [];
  buscado = false;

  constructor(private http: HttpClient) { }

  openModal() {
    this.showPopup = true;
    this.buscado = false;
    this.resultados = [];
    this.busqueda = '';
  }

  closeModal() {
    this.showPopup = false;
  }

  buscar() {
    if (!this.busqueda.trim()) {
      this.resultados = [];
      this.buscado = true;
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/users/buscar/${this.busqueda}`)
      .subscribe({
        next: (data) => {
          this.resultados = data;
          this.buscado = true;
        },
        error: (err) => {
          console.error('Error al buscar usuarios:', err);
          this.resultados = [];
          this.buscado = true;
        }
      });
  }

  crearChat(usuarioId: string) {
    // Obtener el usuario logueado desde localStorage
    const usuarioActual = localStorage.getItem('usuario');
    if (!usuarioActual) {
      console.error('No hay usuario logueado en localStorage');
      return;
    }

    const usuarioParseado = JSON.parse(usuarioActual);
    const usuarioActualId = usuarioParseado._id;

    // Preparamos el body para la solicitud
    const body = {
      users: [usuarioId, usuarioActualId]
    };

    this.http.post('http://localhost:3000/api/chats', body)
      .subscribe({
        next: (data) => {
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear chat:', err);
        }
      });
  }

}
