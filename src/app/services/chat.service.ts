import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface Chat {
  _id: string;
  users: any[]; // ajustá según tu modelo real
  lastMessage?: {
    text: string;
    sender: any;
    timestamp: string;
  };
}

interface Mensaje {
  _id: string;
  chatId: string;
  sender: any;
  text: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/'; // Ajustá el puerto y path si es necesario

  constructor(private http: HttpClient) {}

  getChatsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl + "chats"}/${userId}`);
  }


  // Obtener un chat específico por ID
  getChat(chatId: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/${chatId}`);
  }

  // Obtener los mensajes de un chat
  getMessages(chatId: string): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/chats/${chatId}/messages`);
  }

  // Enviar un mensaje nuevo al chat
  sendMessage(chatId: string, text: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/chats/${chatId}/messages`, { text });
  }
  
}
