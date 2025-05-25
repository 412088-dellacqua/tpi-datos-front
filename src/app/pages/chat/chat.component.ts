import { Component, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { HttpClientModule } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { effect } from '@angular/core';

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
export class ChatComponent implements OnDestroy, AfterViewInit  {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private socket: Socket = io('http://localhost:3000'); // Cambiá al puerto real de tu backend
  usuarioActualId!: string;

  chat = signal<Chat | null>(null);
  mensajes = signal<Mensaje[]>([]);
  nuevoMensaje = signal('');

  constructor(private router: Router) {}


  ngOnInit(): void {
    const chatId = this.route.snapshot.paramMap.get('chatId');

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuarioActualId = usuario._id;

    if (chatId) {
      this.cargarChat(chatId);
      this.cargarMensajes(chatId);

      // Socket: escuchar nuevos mensajes
      this.socket.on('nuevo-mensaje', (mensaje: Mensaje) => {
        if (mensaje.chatId === chatId) {
          this.mensajes.update(msgs => [...msgs, mensaje]);
        }
      });
    }
  }


  ngAfterViewInit(): void {
    effect(() => {
      const mensajesActuales = this.mensajes();
      if (mensajesActuales.length > 0) {
        setTimeout(() => {
          this.scrollToLastChild();
        }, 100);
      }
    });
  }

  scrollToLastChild(): void {
    const container: HTMLElement = this.scrollContainer.nativeElement;
    const hijos = container.children;

    if (hijos.length > 0) {
      const ultimoElemento = hijos[hijos.length - 1] as HTMLElement;
      ultimoElemento.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  cargarChat(chatId: string) {
    this.chatService.getChat(chatId).subscribe(chatData => {
      this.chat.set(chatData);
    });
  }

  cargarMensajes(chatId: string) {
    this.chatService.getMessages(chatId).subscribe(msgs => {
      this.usuarioActualId = JSON.parse(localStorage.getItem('usuario') || '{}')._id;
      this.mensajes.set(msgs);
       setTimeout(() => this.scrollToLastChild(), 150);
    });
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje();
    if (texto.trim().length === 0) return;

    const chatId = this.route.snapshot.paramMap.get('chatId');
    if (!chatId) return;
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    this.chatService.sendMessage(chatId, texto, usuario._id).subscribe();
    this.nuevoMensaje.set('');
  }

  volver() {
    this.router.navigate(['/chats']);
  }

  getNombresUsuarios(): string {
    const c = this.chat();
    if (!c) return '';
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioLogeado = c.users.filter(x => x.username != usuario.username);
    return usuarioLogeado[0].username;
  }

  getAvatar(): string {
    const c = this.chat();
    if (c && c.users && c.users.length > 0) {
      return c.users[0].avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
