import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { Offer } from '../../models/offer.model';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OffersService } from '../../services/offers.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-cart-summarize-page',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule],
  templateUrl: './cart-summarize-page.component.html',
  styleUrl: './cart-summarize-page.component.css'
})
export class CartSummarizePageComponent implements OnInit {
  title = 'Récapitulatif du panier';
  cartItems: any[] = [];
  totalAmount = 0;
  cartId: number | null = null;
  offers: Offer[] = [];
  errorMessage = '';

  // Maps pour affichage
  eventNameMap = new Map<number, string>();
  offerNameMap = new Map<number, string>();
  eventLocationMap = new Map<number, string>();
  eventDateTimeMap = new Map<number, string>();

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private offersService: OffersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offersService.getOffers().subscribe({
      next: (data: Offer[]) => {
        this.offers = data;

        // Remplir les maps
        this.offers.forEach((offer) => {
          if (offer.offerId !== null) {
            this.eventNameMap.set(offer.offerId, offer.eventTitle);
            this.offerNameMap.set(offer.offerId, offer.offerCategoryTitle);
            this.eventLocationMap.set(offer.offerId, offer.eventLocation);
            const date = new Date(offer.eventDateTime);
            this.eventDateTimeMap.set(offer.offerId, date.toISOString());
          }
        });

        this.getCart();
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  getCart(): void {
    this.cartService.getCart().subscribe((cart) => {
      this.cartId = cart.cartId;
      if (this.cartId !== null) {
        this.getCartItems(this.cartId);
      }
      
    });
  }

  getCartItems(cartId: number): void {
    this.cartService.getCartItems(cartId).subscribe((items: CartItem[]) => {
      this.cartItems = items.map((item) => {
        const offerId = item.offerId;
        const eventName = this.eventNameMap.get(offerId) || 'Événement inconnu';
        const offerName = this.offerNameMap.get(offerId) || 'Offre inconnue';
        const eventLocation = this.eventLocationMap.get(offerId) || 'Lieu inconnu';
        const eventDate = this.eventDateTimeMap.get(offerId);

        const formattedDate = eventDate
          ? new Date(eventDate).toLocaleString('fr-FR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Date inconnue';

        return {
          ...item,
          eventName,
          offerName,
          eventLocation,
          totalPrice: item.priceAtPurchase * item.quantity,
          eventDateTimeFormatted: formattedDate,
        };
      });

      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.priceAtPurchase;
    }, 0);
  }

  simulatePayment(simulateFailure: boolean): void {
    if (!this.cartId) {
      this.snackBar.open('Aucun panier trouvé.', 'Fermer', { duration: 2000 });
      return;
    }
  
    this.cartService.simulatePayment(this.cartId, simulateFailure).subscribe({
      next: (message: string) => {
        this.snackBar.open(message, 'Fermer', { duration: 2000 });
        
  
        if (simulateFailure) {
          if (this.cartId !== null) {
            this.getCartItems(this.cartId);
          } // recharge l'ancien panier
        } else {
          // Paiement réussi : nouveau panier
          this.cartService.getCart().subscribe(newCart => {
            this.cartId = newCart.cartId;
            this.cartService.updateCart(newCart); // met à jour le Header
            if (this.cartId !== null) {
              this.getCartItems(this.cartId);
            }
            // Rdirection vers la page des tickets
          this.router.navigate(['/tickets']);
          });
          
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors de la transaction.', 'Fermer', { duration: 2000 });
      },
    });
  }
  
}

