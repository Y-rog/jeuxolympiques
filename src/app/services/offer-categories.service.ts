import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OfferCategory } from '../models/offer-category.model';
import { OfferCategoryRequest } from '../models/offer-category-request';

@Injectable({
  providedIn: 'root'
})
export class OfferCategoriesService {
  private apiUrl = environment.apiUrl + '/offer-categories'

  constructor(private http: HttpClient) {}

  getAll(): Observable<OfferCategory[]> {
    return this.http.get<OfferCategory[]>(this.apiUrl);
  }

  createCategory(category: OfferCategoryRequest): Observable<OfferCategoryRequest> {
    return this.http.post<OfferCategoryRequest>(this.apiUrl, category);
  }

  getCategoryById(id: number): Observable<OfferCategory> {
    return this.http.get<OfferCategory>(`${this.apiUrl}/${id}`);
  }
  updateCategory(id: number, category: OfferCategory): Observable<OfferCategory> {
    return this.http.put<OfferCategory>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
