import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { DateService } from '../../utils/date.service';

@Component({
  selector: 'app-create-event-form',
  imports: [ReactiveFormsModule],
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent implements OnInit {

  createEventForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.createEventForm = this.fb.group({
      eventTitle: ['', [Validators.required]],
      eventDescription: ['', [Validators.required]],
      eventLocation: ['', [Validators.required]],
      eventDateTime: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    console.log('Création de l\'événement', this.createEventForm.value);
    if (this.createEventForm.valid) {
      let formData = this.createEventForm.value;
      // on convertit la date  au format 'yyyy-MM-dd HH:mm' pour le backend grâce au service utils/date.service.ts
      let eventDateTime = new Date(formData.eventDateTime);
      formData.eventDateTime = eventDateTime;
      const dateFormatted = this.dateService.formatDateToString(formData.eventDateTime);
      formData.eventDateTime = dateFormatted;

      const newEvent: Event = formData;
      console.log('Nouvel événement', newEvent);
      this.eventService.createEvent(newEvent).subscribe(response => {
        // Affiche une alerte pour confirmer la création de l'événement
        alert('L\'événement a bien été créé');
      });
    }
  }
}
