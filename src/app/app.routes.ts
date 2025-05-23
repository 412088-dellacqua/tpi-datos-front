import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { ChatComponent } from './pages/chat/chat.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'chats', component: ChatsComponent },
    { path: 'chat', component: ChatComponent },

];