import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // 👈 Asegurate de incluirlo acá
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  providers: [ChatService] // opcional si no está inyectado globalmente
})
export class ChatsComponent {
  chats: any[] = [];

  constructor(private router: Router, private chatService: ChatService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const userId = usuario._id;
    console.log(userId)

    this.chatService.getChatsByUser(userId).subscribe({
      next: (data) => {
        console.log(data)
        this.chats = data.map(chat => {
          const otro = chat.users.find((u: any) => u._id !== userId);

          return {
            id: chat._id,
            nombre: otro.username,  // cambio aquí
            avatar: otro.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png', // si no tienes avatar en user
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
}
