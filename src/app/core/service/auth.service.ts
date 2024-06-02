// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = "9998ee121c5f4a079c5ff6deb08d173b";
  private clientSecret = "594499dbcc5e4ee7b446e9171ac8536e";

  constructor() { }

  // Aquí puedes implementar métodos para obtener un token de acceso usando las credenciales del cliente
}