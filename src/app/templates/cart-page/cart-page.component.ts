import { Component, OnInit } from '@angular/core';
import { HeroSceneComponent } from '../../layout/hero-scene/hero-scene.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { OffersService } from '../../services/offers.service';
import { Offer } from '../../models/offer.model';
import { CartItem } from '../../models/cart-item.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-page',
  imports: [HeroSceneComponent, MatCardModule, CommonModule, MatIcon],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  title = 'Panier';
  cartItems: CartItem[] = [];
  totalAmount = 0;
  cartId: any;
  offers: Offer[] = [];
  errorMessage: string = '';
  eventNameMap: Map<number, string> = new Map();
  offerNameMap: Map<number, string> = new Map();
  eventLocationMap: Map<number, string> = new Map();

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private offersService: OffersService
  ) {}

  ngOnInit(): void {
    // Charger d'abord les offres
    this.loadOffers();
  }

  // Récupérer les offres via le service
  loadOffers(): void {
    this.offersService.getOffers().subscribe({
      next: (data: Offer[]) => {
        this.offers = data;

        // Préparer les données des offres pour une recherche rapide
        this.offers.forEach((offer) => {
          if (offer.offerId !== null) {
            this.eventNameMap.set(offer.offerId, offer.eventTitle);
            this.offerNameMap.set(offer.offerId, offer.offerCategoryTitle);
            this.eventLocationMap.set(offer.offerId, offer.eventLocation);
          }
          
        });

        // Une fois les offres chargées, récupérer le panier
        this.getCart();
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  // Récupérer le panier
  getCart(): void {
    this.cartService.getCart().subscribe((cart) => {
      this.cartId = cart.cartId;
      this.calculateTotalAmount();
      this.getCartItems(this.cartId);
    });
  }

  // Récupérer les articles du panier
  getCartItems(cartId: number): void {
    this.cartService.getCartItems(cartId).subscribe((items) => {
      this.cartItems = items.map((item) => {
        const eventName = this.eventNameMap.get(item.offerId) || 'Inconnu';
        const offerName = this.offerNameMap.get(item.offerId) || 'Inconnu';
        const eventLocation = this.eventLocationMap.get(item.offerId) || 'Inconnu';
        const expirationTime = new Date(item.expirationTime).getTime();
        const currentTime = Date.now();
        const remainingTime = expirationTime - currentTime;

        return {
          ...item,
          eventName,
          offerName,
          eventLocation,
          priceAtPurchase: item.priceAtPurchase,
          quantity: item.quantity,
          totalPrice: item.priceAtPurchase * item.quantity,
          isExpired: remainingTime <= 0,
          timeRemaining: remainingTime > 0 ? remainingTime : 0,
        };
      });
      this.calculateTotalAmount();
      this.startCountdown(); // Démarrage du compte à rebours ici
    });
  }

  // Calculer le montant total du panier
  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.priceAtPurchase * item.quantity;
    }, 0);
  }

  // Supprimer un article du panier
  removeItemFromCart(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe(() => {
      this.snackBar.open('Article supprimé du panier', 'Fermer', { duration: 2000 });
    });
  }

  // Logique pour gérer le compte à rebours
  startCountdown(): void {
    this.cartItems.forEach((item) => {
      const expirationTime = new Date(item.expirationTime).getTime();

      const interval = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = expirationTime - currentTime;

        if (remainingTime <= 0) {
          item.isExpired = true;
          item.timeRemaining = 0;
          clearInterval(interval);
        } else {
          item.isExpired = false;
          item.timeRemaining = remainingTime;
        }
      }, 1000);
    });
  }
}

