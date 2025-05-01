import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';
import { CartItemRequest } from '../models/cart-item-request';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<any | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Créer le panier
  createCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}`, {});
  }

  // Récupérer le panier
  getCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      tap(cart => this.cartSubject.next(cart)) 
    );
  }

  updateCart(cart: any) {
    this.cartSubject.next(cart);
  }

  // Ajouter un article au panier
  addOfferToCart(cartId: number, cartItemRequest: CartItemRequest): Observable<CartItemRequest> {
    return this.http.post<CartItemRequest>(`${this.apiUrl}/${cartId}/items`, cartItemRequest);
  }

  // Récupérer les articles du panier
  getCartItems(cartId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${cartId}/items`);
  }

  // Supprimer un article du panier
  removeItem(cartId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartId}/items/${itemId}`);
  }

  // Simuler un paiement
  simulatePayment(cartId: number, simulateFailure: boolean): Observable<string> {
    const params = new HttpParams().set('simulateFailure', simulateFailure);
    return this.http.post(`${this.apiUrl}/${cartId}/confirm-payment`, null, {
      params,
      responseType: 'text'
    });
  }
  
  
  
  

  // Annuler le paiement
  cancelPayment(cartId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cancel-payment`, { cartId });
  }
}

