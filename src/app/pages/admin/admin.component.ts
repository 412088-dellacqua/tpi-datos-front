import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  vistaActual: string = 'dashboard';
  usuarios: any[] = [];
  usuariosPorMes: any[] = [];

  barChartType: ChartType = 'bar';
  private http = inject(HttpClient);

  // Usuarios por mes (azul)
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Usuarios registrados',
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Palabras más usadas (naranja)
  palabrasChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Palabras más usadas',
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };

  // Chats más activos (verde)
  chatsActivosChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Chats más activos',
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // Evolución de mensajes (violeta)
  evolucionMensajesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Evolución de mensajes',
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  // Mensajes por día de la semana (violeta claro)
  mensajesPorDiaSemanaChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Mensajes por día de la semana',
        backgroundColor: 'rgba(186, 104, 200, 0.7)',
        borderColor: 'rgba(186, 104, 200, 1)',
        borderWidth: 1
      }
    ]
  };

  customQuery: string = '';
  consultaChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const admin = localStorage.getItem('admin');

    if(admin == null){
      this.router.navigate(['/login']);
    }

    this.cargarUsuariosPorMes();
    this.cargarPalabrasMasUsadas();
    this.cargarChatsMasActivos();
    this.cargarEvolucionMensajes();
    this.cargarMensajesPorDiaSemana(); // 👈 agregado
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    if (vista === 'usuarios') {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  cargarUsuariosPorMes() {
    this.http.get<any[]>('http://localhost:3000/api/users/stats/usuarios-por-mes').subscribe({
      next: (data) => {
        this.usuariosPorMes = data;

        this.barChartData = {
          labels: data.map(item => `${item._id.month}/${item._id.year}`),
          datasets: [
            {
              data: data.map(item => item.totalUsers),
              label: 'Usuarios registrados',
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        };
      },
      error: (err) => console.error('Error al obtener estadísticas de usuarios por mes', err)
    });
  }

  cargarPalabrasMasUsadas() {
    this.http.get<any[]>('http://localhost:3000/api/messages/stats/top-palabras').subscribe({
      next: (data) => {
        this.palabrasChartData = {
          labels: data.map(item => item._id),
          datasets: [
            {
              data: data.map(item => item.count),
              label: 'Palabras más usadas',
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            }
          ]
        };
      },
      error: (err) => console.error('Error al obtener palabras más usadas', err)
    });
  }

  cargarChatsMasActivos() {
    this.http.get<any[]>('http://localhost:3000/api/messages/stats/chats-mas-activos').subscribe({
      next: (data) => {
        this.chatsActivosChartData = {
          labels: data.map(chat => `${chat.usuarios.join(', ')} (${chat.chatId.slice(0, 6)})`),
          datasets: [
            {
              data: data.map(chat => chat.totalMensajes),
              label: 'Mensajes por chat',
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        };
      },
      error: (err) => console.error('Error al obtener chats más activos', err)
    });
  }

  cargarEvolucionMensajes() {
    this.http.get<any[]>('http://localhost:3000/api/messages/stats/evolucion-mensajes').subscribe({
      next: (data) => {
        this.evolucionMensajesChartData = {
          labels: data.map(item => item.fecha),
          datasets: [
            {
              data: data.map(item => item.totalMensajes),
              label: 'Evolución de mensajes',
              backgroundColor: 'rgba(153, 102, 255, 0.7)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        };
      },
      error: (err) => console.error('Error al obtener evolución de mensajes', err)
    });
  }

  cargarMensajesPorDiaSemana() {
    this.http.get<any[]>('http://localhost:3000/api/messages/stats/mensajes-por-dia-semana').subscribe({
      next: (data) => {
        this.mensajesPorDiaSemanaChartData = {
          labels: data.map(item => item.dia),
          datasets: [
            {
              data: data.map(item => item.totalMensajes),
              label: 'Mensajes por día de la semana',
              backgroundColor: 'rgba(186, 104, 200, 0.7)',
              borderColor: 'rgba(186, 104, 200, 1)',
              borderWidth: 1
            }
          ]
        };
      },
      error: (err) => console.error('Error al obtener mensajes por día de la semana', err)
    });
  }

  ejecutarConsulta() {
    try {
      const parsedQuery = JSON.parse(this.customQuery); // Validamos que sea JSON válido

      this.http.post<any[]>('http://localhost:3000/api/messages/execute-aggregate', {
        collection: 'users',
        query: parsedQuery
      }).subscribe({
        next: (data) => {
          // Si devuelve algo tipo { _id: { year, month }, totalUsers }
          this.consultaChartData = {
            labels: data.map(item => {
              if (item._id?.year && item._id?.month) {
                return `${item._id.month}/${item._id.year}`;
              }
              return JSON.stringify(item._id);
            }),
            datasets: [{
              data: data.map(item => item.totalUsers || item.count || 0),
              label: 'Resultado de consulta',
              backgroundColor: 'rgba(100, 181, 246, 0.7)',
              borderColor: 'rgba(100, 181, 246, 1)',
              borderWidth: 1
            }]
          };
        },
        error: (err) => {
          console.error('Error ejecutando consulta personalizada', err);
          alert('Error en la consulta. Revisá que sea un JSON válido.');
        }
      });

    } catch (err) {
      alert("La consulta ingresada no es un JSON válido");
    }
  }
}
