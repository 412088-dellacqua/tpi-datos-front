// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private readonly socketUrl = 'http://localhost:3000'; // Ajustá si cambia

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = io(this.socketUrl, {
      transports: ['websocket'], // fuerza WebSocket (opcional)
    });
  }

  // Escuchar eventos del servidor
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Emitir eventos al servidor
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Cerrar conexión si hace falta
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
