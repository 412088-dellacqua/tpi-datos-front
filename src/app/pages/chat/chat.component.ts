import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { HttpClientModule } from '@angular/common/http';

interface Chat {
  _id: string;
  users: Array<{ _id: string; username: string; avatar?: string }>;
  lastMessage?: {
    text: string;
    sender: { _id: string; username: string };
    timestamp: string;
  };
}

interface Mensaje {
  _id: string;
  chatId: string;
  sender: { _id: string; username: string };
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './chat.component.html',
  providers: [ChatService],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);

  // Aquí debes colocar el id del usuario actual (puede venir de tu auth o sesión)
  usuarioActualId = 'TU_ID_DE_USUARIO_AQUI';

  chat = signal<Chat | null>(null);
  mensajes = signal<Mensaje[]>([]);
  nuevoMensaje = signal('');

  ngOnInit(): void {
    const chatId = this.route.snapshot.paramMap.get('chatId');
    if (chatId) {
      this.cargarChat(chatId);
      this.cargarMensajes(chatId);
    }
  }

  cargarChat(chatId: string) {
    this.chatService.getChat(chatId).subscribe(chatData => {
      console.log(chatData),
      this.chat.set(chatData);
    });
  }

  cargarMensajes(chatId: string) {
    this.chatService.getMessages(chatId).subscribe(msgs => {
      this.mensajes.set(msgs);
    });
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje();
    if (texto.trim().length === 0) return;

    const chatId = this.route.snapshot.paramMap.get('id');
    if (!chatId) return;

    this.chatService.sendMessage(chatId, texto).subscribe(nuevoMsg => {
      this.mensajes.update(msgs => [...msgs, nuevoMsg]);
      this.nuevoMensaje.set('');
    });
  }

  volver() {
    // Aquí puedes usar el router para volver, si tienes router inyectado
    // Ejemplo:
    // this.router.navigate(['/chats']);
  }

  getNombresUsuarios(): string {
    const c = this.chat();
    if (!c) return '';
    return c.users.map(u => u.username).join(', ');
  }

  getAvatar(): string {
    const c = this.chat();
    if (c && c.users && c.users.length > 0) {
      return c.users[0].avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
  }

}
