export class Event {
    // Propriétés de l'événement
    eventTitle!: string;
    eventDescription!: string;
    eventLocation!: string;
    eventPlacesNumber!: number;
    eventDateTime!: Date;
    eventId?: number; // ID de l'événement, optionnel pour la création
  }
  