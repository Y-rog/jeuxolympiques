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
  getOffers(): Observable<any> {
    return this.http.get<Offer[]>(this.apiUrl);
  }
   
}
