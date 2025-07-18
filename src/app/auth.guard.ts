import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    // Asegurarse de estar en el navegador antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
