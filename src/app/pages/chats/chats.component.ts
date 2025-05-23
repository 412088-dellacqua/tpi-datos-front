import { Component } from '@angular/core';

@Component({
  selector: 'app-chats',
  imports: [],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent {
  chats = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      hora: '10:32 AM',
      ultimoMensaje: '¡Nos vemos mañana en la reunión!'
    },
    {
      id: 2,
      nombre: 'Ana Gómez',
      avatar: 'https://i.pravatar.cc/150?img=5',
      hora: '9:15 AM',
      ultimoMensaje: '¿Podés enviarme el archivo?'
    },
    {
      id: 3,
      nombre: 'Carlos López',
      avatar: 'https://i.pravatar.cc/150?img=8',
      hora: 'Ayer',
      ultimoMensaje: 'Gracias por tu ayuda :)'
    },
    {
      id: 4,
      nombre: 'María Rodríguez',
      avatar: 'https://i.pravatar.cc/150?img=12',
      hora: 'Lunes',
      ultimoMensaje: '¿Almorzamos hoy?'
    },
    {
      id: 5,
      nombre: 'Soporte Técnico',
      avatar: 'https://i.pravatar.cc/150?img=1',
      hora: 'Domingo',
      ultimoMensaje: 'Tu ticket ha sido actualizado.'
    }
  ];

  abrirChat(chatId: number): void {
    // Aquí iría la navegación o lógica para abrir el chat
    console.log('Abrir chat con ID:', chatId);
    // Por ejemplo: this.router.navigate(['/chat', chatId]);
  }
}
