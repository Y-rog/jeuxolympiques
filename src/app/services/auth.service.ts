import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtResponse } from '../models/jwt-response.model';
import { LoginRequest } from '../models/login-request.model';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../models/register-request.model';
import { MyJwtPayload } from '../models/jwt-payload.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth/login`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.authUrl, loginRequest);
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, registerRequest);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.tokenKey) !== null;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getRolesFromToken() {
    const token = this.getToken();
    const decodedToken = token ? this.decodeToken(token) : null;
  
    if (decodedToken) {
      // Vérifie si 'roles' existe et contient des éléments
      if (decodedToken.roles && decodedToken.roles.length > 0) {
        // Retourner tous les rôles sous forme de tableau de chaînes
        return decodedToken.roles.map(role => role.authority);
      }
    }
  
    return [];  // Retourne un tableau vide si aucun rôle n'est trouvé
  }
  
  // Méthode pour décoder le token JWT et obtenir un type spécifique
  private decodeToken(token: string): MyJwtPayload | null {
    try {
      const decoded = jwtDecode<MyJwtPayload>(token);  // Décoder le token
      return decoded;
    } catch (error) {
      return null;
    }
  }
  
  getDecodedToken() {
    const token = sessionStorage.getItem(this.tokenKey);
    if (token) {
      return this.decodeToken(token);  // Décoder le token et retourner le payload
    }
    return null;  // Retourner null si aucun token n'est trouvé
  }

  
}