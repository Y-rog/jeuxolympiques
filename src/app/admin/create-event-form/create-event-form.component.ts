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
import { dateInFutureValidator } from '../../validators/date.validator';

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
      eventPlacesNumber: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
      eventDateTime: ['', [Validators.required, dateInFutureValidator()]], 
    });
  }

  onSubmit(): void {
    if (this.createEventForm.valid) {
      let formData = this.createEventForm.value;
  
      // Convertir la date en format 'dd/MM/yyyy HH:mm' pour le backend
      let eventDateTime = new Date(formData.eventDateTime);
      formData.eventDateTime = eventDateTime;
  
      const dateFormatted = this.dateService.formatDateToString(formData.eventDateTime);
      formData.eventDateTime = dateFormatted;
  
      const newEvent: Event = formData;
  
      this.eventService.createEvent(newEvent).pipe(
        tap(() => {
          this.successMessage = `L'événement ${newEvent.eventTitle} a bien été créé !`;
          this.errorMessage = null;
  
          // Réinitialiser et nettoyer le formulaire
          this.createEventForm.reset({}, { emitEvent: false });
          this.createEventForm.markAsPristine();
          this.createEventForm.markAsUntouched();
          Object.keys(this.createEventForm.controls).forEach(key => {
            this.createEventForm.get(key)?.setErrors(null);
          });
  
          // Masquer le message de succès après 5 secondes
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);
        }),
        catchError(() => {
          this.errorMessage = 'Une erreur est survenue lors de la création de l\'événement. Veuillez réessayer.';
          this.successMessage = null;
          return of(null);
        })
      ).subscribe();
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      this.successMessage = null;
    }
  }
  
}

