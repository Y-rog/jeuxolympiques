import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Importation du service d'authentification
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Injection du service d'authentification
  const router = inject(Router);  // Injection du router pour la redirection

  if (authService.isAuthenticated()) {
    return true;  // L'utilisateur est authentifié, autorisez l'accès
  } else {
    router.navigate(['/login']);  // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
    return false;  // Bloquez l'accès
  }
};
