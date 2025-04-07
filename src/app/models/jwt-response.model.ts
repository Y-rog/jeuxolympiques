// login-response.model.ts

export interface JwtResponse {
    username: string;         // Le nom d'utilisateur
    roles: string[];          // Les rôles de l'utilisateur
    token: string;      // Le jeton d'accès JWT
  }
  