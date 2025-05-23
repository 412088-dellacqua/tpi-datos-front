import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Mensaje {
  texto: string;
  propio: boolean;
}

interface Chat {
  nombre: string;
  avatar: string;
}
@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  chat = signal<Chat>({
    nombre: 'María López',
    avatar: 'https://i.pravatar.cc/300?img=5'
  });

  mensajes = signal<Mensaje[]>([
    { texto: 'Hola, ¿cómo estás?', propio: false },
    { texto: 'Todo bien, ¿vos?', propio: true },
    { texto: 'Re bien, gracias por preguntar 😊', propio: false },
    { texto: '¡Qué bueno! ¿Vamos al cine hoy?', propio: true },
    { texto: '¡Dale!', propio: false }
  ]);

  nuevoMensaje = signal('');

  enviarMensaje() {
    const texto = this.nuevoMensaje();
    if (texto.trim().length === 0) return;

    this.mensajes.update((msgs) => [...msgs, { texto, propio: true }]);
    this.nuevoMensaje.set('');
  }

  volver() {
    // Aquí podés poner la lógica para volver a la lista de chats
    console.log('Volviendo a la lista de chats');
  }
}
