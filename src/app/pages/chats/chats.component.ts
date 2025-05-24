import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

import { io, Socket } from 'socket.io-client';  // 👈 Importar socket.io-client

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  providers: [ChatService]
})
export class ChatsComponent {
  chats: any[] = [];
  socket: Socket;   // 👈 declarar la variable socket
  userId: string = '';
  nombreUsuario?: string;

  constructor(private router: Router, private chatService: ChatService) {
    this.socket = io('http://localhost:3000');  // 👈 conectar con el servidor Socket.IO
  }

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.userId = usuario._id;
    this.nombreUsuario = usuario.username

    this.cargarChats();

    // Escuchar evento 'nuevo-chat'
    this.socket.on('nuevo-chat', (chat: any) => {
      console.log('Nuevo chat recibido por socket:', chat); // 👈 AGREGÁ ESTO
      // Solo agregar el chat si el usuario está en la lista del chat
      if (chat.users.includes(this.userId)) {
        // Preparar la estructura para mostrar
        const otro = chat.users.find((u: string) => u !== this.userId);
        this.buscarUsuario(otro);
      
      }
    });
  }

  cargarChats() {
    this.chatService.getChatsByUser(this.userId).subscribe({
      next: (data) => {
        this.chats = data.map(chat => {
          const otro = chat.users.find((u: any) => u._id !== this.userId);
          return {
            id: chat._id,
            nombre: otro.username,
            avatar: otro.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
            hora: chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp).toLocaleTimeString() : '',
            ultimoMensaje: chat.lastMessage?.text || 'Sin mensajes aún'
          };
        });
      },
      error: (err) => {
        console.error('Error al cargar los chats:', err);
      }
    });
  }

  abrirChat(chatId: number): void {
    this.router.navigate(['/chat', chatId]);
  }

  cerrarSession(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  buscarUsuario(id: string): any {
  this.chatService.getUsuarioPorId(id).subscribe({
    next: (usuario) => {
      console.log(usuario);
        const chatFormateado = {
          id: usuario._id,
          nombre: usuario.username || 'Desconocido',
          avatar: usuario.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
          hora: usuario.lastMessage?.timestamp ? new Date(usuario.lastMessage.timestamp).toLocaleTimeString() : '',
          ultimoMensaje: usuario.lastMessage?.text || 'Sin mensajes aún'
        };
        this.chats.push(chatFormateado);
    },
    error: (err) => {
      console.error('Error al buscar usuario:', err);
    }
  });
}

}
