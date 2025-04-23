import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Offer } from '../models/offer.model';
@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private apiUrl = environment.apiUrl + '/offers'

  constructor(private http: HttpClient) {}

  // Récupérer la liste des offres
  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  // Vérifier la disponibilité des places pour un évenemnt
  checkEventAvailability(offerId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${offerId}/check-availability`);
  }

  // Restaurer la disponibilité d'une offre
  restoreAvailability(offerId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${offerId}/restore-availability`, null);
  }
  
   
}
