import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Importation du service d'authentification
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Injection du service d'authentification
  const router = inject(Router);  // Injection du router pour la redirection

  if (authService.isAuthenticated()) {
    // Vérifier si l'utilisateur a un rôle d'admin
    const roles = authService.getRolesFromToken();
    // Si l'utilisateur a le rôle ADMIN, autoriser l'accès
    if (roles.includes('ADMIN')) {
      return true; 
    } else {
      router.navigate(['/home']); // Si l'utilisateur n'est pas admin, rediriger vers la page d'accueil
      return false; // Bloquer l'accès
    }
  } else {
    router.navigate(['/login']);  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    return false;  // Bloquer l'accès
  }
};



