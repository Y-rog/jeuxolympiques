import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { DateService } from '../../utils/date.service';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-event-form',
  imports: [ReactiveFormsModule, MatButton, MatInputModule, MatDatepickerModule, NgIf],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent {

  createEventForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private dateService: DateService
  ) {
    // Initialisation du formulaire directement dans le constructeur
    this.createEventForm = this.fb.group({
      eventTitle: ['', [Validators.required, Validators.maxLength(50)]],
      eventDescription: ['', [Validators.required, Validators.maxLength(500)]],
      eventLocation: ['', [Validators.required, Validators.maxLength(50)]],
      eventDateTime: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.createEventForm.valid) {
      let formData = this.createEventForm.value;
  
      // Convertir la date en format 'yyyy-MM-dd HH:mm' pour le backend
      let eventDateTime = new Date(formData.eventDateTime);
      formData.eventDateTime = eventDateTime;
  
      const dateFormatted = this.dateService.formatDateToString(formData.eventDateTime);
      formData.eventDateTime = dateFormatted;
  
      const newEvent: Event = formData;
  
      // Utiliser pipe() pour gérer la réponse de l'API
      this.eventService.createEvent(newEvent).pipe(
        tap((response) => {
          // Message de succès en cas de création réussie
          this.successMessage = `L'événement ${newEvent.eventTitle} a bien été créé !`;
          this.errorMessage = null;  // Réinitialiser le message d'erreur
          this.createEventForm.reset();  // Réinitialiser le formulaire
  
          // Masquer le message de succès après 5 secondes
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);
        }),
        catchError((error) => {
          // Gérer les erreurs d'appel API
          console.error('Erreur lors de la création de l\'événement', error);
          this.errorMessage = 'Une erreur est survenue lors de la création de l\'événement. Veuillez réessayer.';
          this.successMessage = null;  // Réinitialiser le message de succès
  
          // Retourner un observable vide pour ne pas interrompre le flux
          return of(null); // Cela retourne une valeur par défaut ou un "vide"
        })
      ).subscribe();  // Le subscribe sans action supplémentaire si nécessaire
    } else {
      // Si le formulaire n'est pas valide, afficher un message d'erreur
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      this.successMessage = null;  // Réinitialiser le message de succès
    }
  }
}

