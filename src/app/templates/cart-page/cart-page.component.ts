import { Component, OnInit } from '@angular/core';
import { HeroSceneComponent } from '../../layout/hero-scene/hero-scene.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OffersService } from '../../services/offers.service';
import { Offer } from '../../models/offer.model';
import { CartItem } from '../../models/cart-item.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CountdownPipe } from '../../pipes/countdown.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CartItemWithFade extends CartItem {
  isFadingOut?: boolean;
}
@Component({
  selector: 'app-cart-page',
  imports: [HeroSceneComponent, MatCardModule, CommonModule, MatIcon, CountdownPipe, MatButton],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})

export class CartPageComponent implements OnInit {
  title = 'Panier';
  cartItems: CartItemWithFade[] = [];
  totalAmount = 0;
  cartId: any;
  offers: Offer[] = [];
  errorMessage: string = '';
  eventNameMap: Map<number, string> = new Map();
  offerNameMap: Map<number, string> = new Map();
  eventLocationMap: Map<number, string> = new Map();

  constructor(
    private cartService: CartService,
    private offersService: OffersService,
    private snackBar: MatSnackBar,
    private router: Router,
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
          totalPrice: item.priceAtPurchase * item.quantity,
          isExpired: remainingTime <= 0,
          timeRemaining: remainingTime > 0 ? remainingTime : 0,
        };
      });
      this.calculateTotalAmount();
      this.startCountdown();
    });
  }

  // Calculer le montant total du panier
  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.priceAtPurchase;
    }, 0);
  }

  // Supprimer un article du panier
  removeItemFromCart(itemId: number): void {
    //On r// On récupère l'id de l'offre
    const offerId = this.cartItems.find(item => item.cartItemId === itemId)?.offerId;
    // On récupère l'offre correspondante
    const offer = this.offers.find(offer => offer.offerId === offerId);
    // On récupère l'id de l'événement
    const eventId = offer?.eventId;   
    this.cartService.removeItem(this.cartId, itemId).subscribe(() => {
      // Retire visuellement l'article supprimé de la liste
      this.cartItems = this.cartItems.filter(item => item.cartItemId !== itemId);
      // On met à jour la disponibilité de l'offre
      if (eventId) {
        this.offersService.updateOffersAvailabilityByEvent(eventId).subscribe(() => {
          console.log('Disponibilité de l\'offre mise à jour');
        });
      } else {
        console.error('Aucun événement trouvé pour l\'offre supprimée.');
      }
      // Recalcul du total
      this.calculateTotalAmount();
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
          this.removeItemFromCart(item.cartItemId);
        } else {
          item.isExpired = false;
          item.timeRemaining = remainingTime;
        }
      }, 1000);
    });
  }

  // Méthode pour aller à la page de paiement
  goToPayment(): void {
    this.router.navigate([`/cart/${this.cartId}/cart-summary`]);
  }

  emptyCart(): void {
    console.log('Panier vide');
  }

}

