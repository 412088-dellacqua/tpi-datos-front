import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { ChatComponent } from './pages/chat/chat.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './auth.guard'; // asegurate que esté bien la ruta
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'chat/:chatId', component: ChatComponent, canActivate: [AuthGuard] },
];