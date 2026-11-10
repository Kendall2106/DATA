// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = "9998ee121c5f4a079c5ff6deb08d173b";
  private clientSecret = "594499dbcc5e4ee7b446e9171ac8536e";

  private auth: Auth = inject(Auth);
  user$: Observable<User | null> = authState(this.auth);

  constructor() { }

  // El usuario escribe solo su nombre; Firebase Auth lo maneja como correo interno
  async login(username: string, password: string): Promise<void> {
    const email = `${username.trim().toLowerCase()}@hobbies.app`;
    await signInWithEmailAndPassword(this.auth, email, password);
    this.setSessionHint(true);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.setSessionHint(false);

    // El color es de cada usuario: se limpia al cerrar sesion
    document.documentElement.style.removeProperty('--color-2');
    try { localStorage.removeItem('hobbies-color'); localStorage.removeItem('colorLocal'); } catch { }
  }

  // Recuerda en este navegador que hay una sesion iniciada, para no esperar a Firebase al recargar la pagina
  hasSessionHint(): boolean {
    try {
      return localStorage.getItem('hobbies-session') === '1';
    } catch {
      return false;
    }
  }

  setSessionHint(active: boolean): void {
    try {
      if (active) {
        localStorage.setItem('hobbies-session', '1');
      } else {
        localStorage.removeItem('hobbies-session');
      }
    } catch { }
  }

  async getMemberSince(): Promise<string> {
    const user = await firstValueFrom(authState(this.auth));
    const created = user?.metadata?.creationTime;
    return created ? new Date(created).toLocaleDateString('es', { month: 'long', year: 'numeric' }) : '';
  }

  async getUsername(): Promise<string> {
    const user = await firstValueFrom(authState(this.auth));
    const name = user?.email ? user.email.split('@')[0] : '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  async getUid(): Promise<string> {
    const user = await firstValueFrom(authState(this.auth));
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return user.uid;
  }

}