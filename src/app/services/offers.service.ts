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

  // Vérifier la disponibilité des places pour une offre avec quantité demandée
  checkOfferAvailability(offerId: number, requestedQuantity: number): Observable<boolean> {
    // Passer `requestedQuantity` comme un paramètre de requête
    return this.http.get<boolean>(`${this.apiUrl}/${offerId}/check-availability`, {
      params: { requestedQuantity: requestedQuantity.toString() }
    });
  }

  
  toggleActive(offerId: number): Observable<boolean> {
  return this.http.patch<boolean>(`${this.apiUrl}/${offerId}/toggle-active`, {});
  }
  
  // Vérifier la disponibilité des places pour un évenemnt
  updateOffersAvailabilityByEvent(eventId: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/update-offers-availability/event/${eventId}`);
  }
  
  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer);
  }

  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  getAllOffersForAdmin(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/admin`);
  }

  getOfferById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  updateOffer(id: number, offer: Offer): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, offer);
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
