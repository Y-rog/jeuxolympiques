import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [ MatButton, RouterLink, RouterLinkActive, CommonModule, MatIconModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isAdmin: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfAdmin();
      });

    // Vérifier au démarrage si l'utilisateur est dans l'espace admin
    this.checkIfAdmin();
  }

  // Fonction pour vérifier si on est dans l'espace admin et si l'utilisateur a le rôle admin
  private checkIfAdmin(): void {
    const currentUrl = this.router.url;
    const isAdminRoute = currentUrl.includes('/admin');
    
    // Vérifier si l'utilisateur a le rôle admin dans le cookie grace au signal
    const userRole = this.router.getCurrentNavigation()?.extras.state?.['userRole'] || 'user'; // Remplacez par la logique pour obtenir le rôle de l'utilisateur

    this.isAdmin = isAdminRoute && userRole === 'admin';
  }
  
}
