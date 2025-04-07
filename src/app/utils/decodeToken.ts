import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtUtils {
  // Méthode pour décoder un token JWT
  decodeToken<T>(token: string): T | null {
    try {
      return jwtDecode<T>(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT', error);
      return null;
    }
  }
}
