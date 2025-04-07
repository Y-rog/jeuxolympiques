import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  imports: [MatButton, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  hide: boolean = true; // Pour masquer ou afficher le mot de passe

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire avec validation
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],  // Validation de l'email
      password: ['', [Validators.required]]  // Validation du mot de passe
    });
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;  // Ne rien faire si le formulaire est invalide
    }

    // Récupération des valeurs du formulaire
    const loginRequest: LoginRequest = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    };

    // Appel du service d'authentification pour s'authentifier
    this.authService.login(loginRequest).subscribe({
      next: (JwtResponse) => {
        if (JwtResponse && JwtResponse.token) {
          // Sauvegarder le token JWT dans sessionStorage
          this.authService.saveToken(JwtResponse.token);

          // Vérifier les rôles et rediriger vers la bonne page
          if (JwtResponse.roles.includes('ADMIN')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }

          // Réinitialiser le formulaire après la connexion
          this.loginForm.reset();
        } else {
          this.errorMessage = 'Le serveur n\'a pas renvoyé de token JWT';
        }
      },
      error: (err: HttpErrorResponse) => {
        // Gestion des erreurs lors de l'authentification
        if (err.status === 401) {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        } else {
          this.errorMessage = 'Une erreur est survenue, veuillez réessayer';
        }
      }
    });
  }
}
