import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'  // Ce service est disponible globalement
})
export class EventService {

  private apiUrl = 'http://localhost:8081/api-jeuxolympiques/event';  // URL de ton API backend

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer l'événement au backend
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

}
