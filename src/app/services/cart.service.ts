import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Offer } from '../models/offer.model';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';
import { CartItemRequest } from '../models/cart-item-request';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  // Créer le panier
  createCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}`, {});
  }

  // Récupérer le panier
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}`);
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
  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${itemId}`);
  }
}

