import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ MatButton, RouterLink, RouterLinkActive, CommonModule, MatIconModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);
  isAdmin: boolean = false;
  isLoggedIn: boolean = false; // Variable pour vérifier si l'utilisateur est connecté

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfAdmin();
        this.checkIfLoggedIn();
      });

    // Vérifier au démarrage si l'utilisateur est dans l'espace admin
    this.checkIfAdmin();

    // Vérifier au démarrage si l'utilisateur est connecté
    this.checkIfLoggedIn();
  }

  // Fonction pour vérifier si on est dans l'espace admin 
  private checkIfAdmin(): void {
    const currentUrl = this.router.url;
    const isAdminRoute = currentUrl.includes('/admin');
    
    // Vérifier si l'utilisateur a le rôle admin grace au token JWT
    const token = this.authService.getRolesFromToken();
    const userRoles = [...token];
    const userRole = userRoles.find(role => role === 'ADMIN') || null;
    
    this.isAdmin = isAdminRoute && userRole === 'ADMIN';
  }

  checkIfLoggedIn(): void {
    // Vérifier si l'utilisateur est connecté
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false;
    }
  }


  logout() {
    // Appeler le service d'authentification pour se déconnecter
    this.authService.logout();  
    // Réinitialiser les variables d'état
    this.isAdmin = false;
    this.isLoggedIn = false;
    this.router.navigate(['/home']);  // Rediriger l'utilisateur vers la page d'accueil
  }


  
}
