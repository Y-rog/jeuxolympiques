import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [ MatButton, RouterLink, RouterLinkActive, CommonModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

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
