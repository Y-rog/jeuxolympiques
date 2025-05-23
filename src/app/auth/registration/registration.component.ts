import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { RegisterRequest } from '../../models/register-request.model';



@Component({
  selector: 'app-registration',
  imports: [MatButton, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm: FormGroup;
  errorMessage: string= '';
  hide: boolean = true; // Pour masquer ou afficher le mot de passe

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire avec validation
    this.registerForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],  // Validation du prénom
      lastname: ['', [Validators.required]],  // Validation du nom
      username: ['', [Validators.required, Validators.email]],  // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=(.*[A-Z]))(?=(.*[0-9]))(?=(.*[\W_]))[A-Za-z0-9\W_]{8,}$/)]],  // Validation du mot de passe
      confirmPassword: ['', [Validators.required]]  // Validation de la confirmation du mot de passe
    }, { validators: this.passwordMatchValidator } as any);  // Appel du validateur personnalisé
  }

  ngOnInit(): void {
    // Mise à jour de la validation si un des champs change
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Validation pour vérifier si les mots de passe correspondent
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPasswordControl = form.get('confirmPassword');

    if (password && confirmPasswordControl) {
      const confirmPassword = confirmPasswordControl.value;
      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        // Important : retirer l’erreur passwordMismatch si les mots de passe correspondent
        if (confirmPasswordControl.hasError('passwordMismatch')) {
          const errors = { ...confirmPasswordControl.errors };
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            confirmPasswordControl.setErrors(null);
          } else {
            confirmPasswordControl.setErrors(errors);
          }
        }
        return null;
      }
    }
    return null;
  }


  // Soumettre le formulaire
  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerRequest: RegisterRequest = {
        firstname: this.registerForm.get('firstname')?.value,
        lastname: this.registerForm.get('lastname')?.value,
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value
      };
      
      this.authService.register(registerRequest).pipe(first()).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = 'Erreur lors de l\'inscription. Veuillez vérifier vos informations.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          }
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

}
