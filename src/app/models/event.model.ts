// src/app/models/event.model.ts
export class Event {
    constructor(
      public eventTitle: string,
      public eventDescription: string,
      public eventLocation: string,
      public eventPlacesNumber: number,
      public eventDateTime: Date
    ) {}   
  }
  