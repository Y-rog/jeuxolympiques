import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HeroSceneComponent } from '../../layout/hero-scene/hero-scene.component';
import { CommonModule } from '@angular/common';
import { OffersService } from '../../services/offers.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatHeaderCell, MatTableDataSource, MatHeaderRow, MatRowDef, MatRow, MatCell, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Offer } from '../../models/offer.model';
import { CartService } from '../../services/cart.service';
import { CartItemRequest } from '../../models/cart-item-request';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [
    HeroSceneComponent,
    CommonModule,
    MatButtonModule,
    MatRow, MatRowDef,
    MatFormField, MatLabel, MatSelect, FormsModule,
    MatOption, MatTableModule,
    MatCell, MatHeaderCell, MatIcon,
    MatHeaderRow, MatSortModule
  ],
  templateUrl: './offers-page.component.html',
  styleUrl: './offers-page.component.css'
})
export class OffersPageComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  offers = new MatTableDataSource<Offer>();
  category: string[] = [];
  selectedCategory: string = '';
  title = "Les Offres";
  subtitle = "Bénéficiez de nos réductions avec les formules Duo et Familliale !";
  displayedColumns: string[] = [
    'eventTitle', 'offerCategoryTitle', 'offerCategoryPlacesPerOffer',
    'eventDateTime', 'eventLocation', 'price', 'availability', 'action'
  ];

  constructor(
    private offersService: OffersService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    this.offersService.getOffers().subscribe((data: Offer[]) => {
      this.offers.data = data;
      this.category = Array.from(new Set(data.map(o => o.offerCategoryTitle)));
    });
  }

  ngAfterViewInit() {
    this.offers.sort = this.sort;
  }

  applyFilter() {
    this.offers.filterPredicate = (data: Offer, filter: string) =>
      data.offerCategoryTitle.trim().toLowerCase() === filter.trim().toLowerCase();

    this.offers.filter = this.selectedCategory || '';
  }

  addToCart(offer: Offer): void {
    if (offer.offerId === null) {
      this.showSnackBar("L'identifiant de l'offre est invalide.");
      return;
    }
    this.offersService.checkOfferAvailability(offer.offerId, 1).subscribe((isAvailable) => {
      if (!isAvailable) {
        this.showSnackBar("L'offre n'est pas disponible.");
        return;
      }

      this.cartService.getCart().subscribe((cart) => {
        if (!cart) {
          this.cartService.createCart().subscribe((newCart) => {
            this.addItemToCart(newCart.cartId, offer);
          });
        } else {
          this.addItemToCart(cart.cartId, offer);
        }
      });

      this.offersService.updateOffersAvailabilityByEvent(offer.eventId).subscribe({
        next: () => console.log("Disponibilité mise à jour pour l'événement", offer.eventId),
        error: (err) => console.error("Erreur de mise à jour de disponibilité :", err)
      });
    });
  }

  private addItemToCart(cartId: number, offer: Offer): void {
    const cartItemRequest: CartItemRequest = {
      offerId: offer.offerId ?? 0,
      priceAtPurchase: offer.price ?? 0,
      cartId: cartId,
    };

    this.cartService.addOfferToCart(cartId, cartItemRequest).subscribe(() => {
      this.showSnackBar("L'offre a été ajoutée au panier.");
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }
}

