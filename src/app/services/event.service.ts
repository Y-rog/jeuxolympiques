import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'  // Ce service est disponible globalement
})
export class EventService {
  private apiUrl = environment.apiUrl + '/event';  // URL de ton API backend

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer l'événement au backend
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  // Méthode pour récupérer tous les événements
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }


}
