import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CartService } from '../../services/cart.service';
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
  inAdminView: boolean = false; // Variable pour vérifier si l'utilisateur est dans l'espace admin
  isLoggedIn: boolean = false; // Variable pour vérifier si l'utilisateur est connecté
  cartId: number | undefined;
  mobileView: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(private router: Router, private cartService: CartService) {}

  // components/header/header.component.ts

  ngOnInit(): void {
    this.onResize();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkIfAdmin();
        this.checkIfLoggedIn();
        this.inAdminView = event.urlAfterRedirects.startsWith('/admin');
      });

    this.checkIfAdmin();
    this.checkIfLoggedIn();
    this.inAdminView = this.router.url.startsWith('/admin');

    this.authService.token$.subscribe(token => {
      if (token) {
        this.cartService.getCart().subscribe();
      }
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartId = cart?.cartId;
    });
  }



  // Fonction pour vérifier si on est dans l'espace admin
  private checkIfAdmin(): void {
    const token = this.authService.getRolesFromToken();
    this.isAdmin = token?.includes('ADMIN') ?? false; // Vérifier si l'utilisateur a le rôle 'ADMIN'
  }

  // Fonction pour vérifier si l'utilisateur est connecté
  checkIfLoggedIn(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    this.authService.logout();  // Appeler le service d'authentification pour se déconnecter
    this.isAdmin = false;
    this.isLoggedIn = false;
    this.router.navigate(['/home']);  // Rediriger l'utilisateur vers la page d'accueil
  }

  // Récupérer le panier de l'utilisateur
  getCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartId = cart.cartId;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du panier:', error);
        this.router.navigate(['/home']);
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.mobileView = window.innerWidth <= 768;
    if (!this.mobileView) {
      this.mobileMenuOpen = false;
    }
  }

  closeMobileMenu(): void {
    if (this.mobileView) {
      this.mobileMenuOpen = false;
    }
  }
  
  quitAdminView(): void {
    this.router.navigate(['/home']);
    this.inAdminView = false;
  }


}

