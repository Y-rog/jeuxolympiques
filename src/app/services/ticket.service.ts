import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketResponse } from '../models/ticket-response.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl + '/tickets';  // URL de ton API backend
  
  constructor(private http: HttpClient) {}


  getTicket(ticketId: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.apiUrl}/${ticketId}`);
  }

  getTickets(): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.apiUrl}/me`);  // Ajuste l'URL si nécessaire
  }

}
