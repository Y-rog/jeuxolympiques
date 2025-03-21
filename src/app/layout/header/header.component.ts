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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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

  // Fonction pour vérifier si on est dans l'espace admin
  private checkIfAdmin(): void {
    // Exemple : Si l'URL commence par '/admin', on considère que l'utilisateur est dans l'espace admin
    this.isAdmin = this.router.url.startsWith('/admin');
  }
  
}
