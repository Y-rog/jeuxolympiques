import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { DateService } from '../../utils/date.service';  // Assurez-vous que vous avez ce service pour gérer la date.
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [MatButton, MatInputModule, MatDatepickerModule, ReactiveFormsModule, NgIf],
  templateUrl: './update-event-form.component.html',
  styleUrls: ['./update-event-form.component.css', '../create-event-form/create-event-form.component.css']
})
export class UpdateEventFormComponent implements OnInit {
  updateEventForm!: FormGroup;
  eventId: string | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private dateService: DateService  // Injection du service DateService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.updateEventForm = this.fb.group({
      eventTitle: ['', [Validators.required, Validators.maxLength(50)]],
      eventDescription: ['', [Validators.required, Validators.maxLength(500)]],
      eventLocation: ['', [Validators.required, Validators.maxLength(50)]],
      eventPlacesNumber: ['', Validators.required],
      eventDateTime: ['', Validators.required]
    });

    // Récupération de l'événement et gestion de la date
    if (this.eventId) {
      this.eventService.getEventById(Number(this.eventId)).subscribe({
        next: (event) => {
          // Formater la date récupérée pour l'afficher dans le formulaire
          const date = new Date(event.eventDateTime); 
          const formattedDate = this.dateService.formatDateForInput(date);

          // Remplir le formulaire avec les valeurs récupérées
          this.updateEventForm.patchValue({
            eventTitle: event.eventTitle,
            eventDescription: event.eventDescription,
            eventLocation: event.eventLocation,
            eventPlacesNumber: event.eventPlacesNumber,
            eventDateTime: formattedDate  // Utilisation de la date formatée pour l'affichage
          });
        },
        error: () => {
          this.errorMessage = "Impossible de charger l'événement.";
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.eventId || this.updateEventForm.invalid) return;
  
    const formData = this.updateEventForm.value;
  
    const date = new Date(formData.eventDateTime);
    formData.eventDateTime = this.dateService.formatDateToString(date); // format "dd/MM/yyyy HH:mm"

    console.log('FormData:', formData); // Debugging: Afficher les données du formulaire avant l'envoi
  
    this.eventService.updateEvent(Number(this.eventId), formData).subscribe({
      next: () => {
        this.successMessage = 'Événement mis à jour avec succès !';
        this.router.navigate(['/admin/event-list']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour de l\'événement.';
      }
    });
  }
  
}



