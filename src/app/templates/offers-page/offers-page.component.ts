import { AfterViewInit, Component, ViewChild} from '@angular/core';
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
import { CartItemUpdateRequest } from '../../models/cart-item-update-request';

@Component({
  selector: 'app-offers-page',
  imports: [HeroSceneComponent, CommonModule, MatButtonModule, MatRow, MatRowDef, MatFormField, MatLabel, MatSelect, FormsModule, MatOption, MatTableModule, MatCell, MatHeaderCell, MatIcon, MatHeaderRow, MatSortModule, MatError],
  templateUrl: './offers-page.component.html',
  styleUrl: './offers-page.component.css'
  
})
export class OffersPageComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  offers = new MatTableDataSource<Offer>();
  category: string[] = [];
  filteredOffers: Offer[] = [];
  selectedCategory: string = '';
  title: string = "Les Offres";
  subtitle: string = "Bénéficiez de nos réductions avec les formules Duo et Familliale !";
  displayedColumns: string[] = ['eventTitle', 'offerCategoryTitle', 'offerCategoryPlacesPerOffer', 'eventDateTime', 'eventLocation', 'price', 'availability', 'quantity', 'action'];

  constructor(
    private offersService: OffersService, 
    private cartService: CartService, 
    private snackBar: MatSnackBar
  ) {
    this.offersService.getOffers().subscribe((data: Offer[]) => {
      this.offers.data = data;
      this.category = Array.from(new Set(data.map(offer => offer.offerCategoryTitle))); 
      this.filteredOffers = data;
    });
  }

  ngAfterViewInit() {
    this.offers.sort = this.sort;
  }

  loadOffers(data: Offer[]) {
    this.offers.data = data;
  }

  // Méthode pour filtrer
  applyFilter() {
    this.offers.filterPredicate = (data: Offer, filter: string) =>
      data.offerCategoryTitle.trim().toLowerCase() === filter.trim().toLowerCase();

    if (this.selectedCategory) {
      this.offers.filter = this.selectedCategory;
    } else {
      this.offers.filter = ''; // Affiche tout
    }
  }

  // Méthode pour ajouter une offre au panier
  addToCart(offer: any): void {
    // qauntitté offres à ajouter
    const quantityOfferToAdd = offer.quantity ?? 1;

      this.cartService.getCart().subscribe((cart) => {
        if (!cart) {
          this.handleCreateCartAndAddItem(offer, quantityOfferToAdd);
        } else {
          this.handleExistingCart(cart.cartId, offer, quantityOfferToAdd);
        }
      });
  }

  // Méthode pour créer un panier et ajouter l'offre
  private handleCreateCartAndAddItem(offer: any, quantityToAdd: number): void {
    this.cartService.createCart().subscribe((newCart) => {
      this.addItemToCart(newCart.cartId, offer, quantityToAdd);
    });
  }

  // Méthode pour gérer un panier existant
  private handleExistingCart(cartId: number, offer: any, quantityToAdd: number): void {
    this.cartService.getCartItems(cartId).subscribe((items) => {
      const existingItem = items.find(item => item.offerId === offer.offerId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;

        if (newQuantity > 5) {
          this.showSnackBar("Impossible d'ajouter plus de 5 fois cette offre");
          return;
        }

        const updateRequest: CartItemUpdateRequest = { quantity: newQuantity };
        this.cartService.updateItemQuantity(cartId, existingItem.cartItemId, updateRequest).subscribe(() => {
          this.showSnackBar("Quantité mise à jour dans le panier");
        });
      } else {
        this.addItemToCart(cartId, offer, quantityToAdd);
      }
    });
  }

  // Méthode pour ajouter un article au panier
  private addItemToCart(cartId: number, offer: any, quantityToAdd: number): void {
    if (quantityToAdd > 5) {
      this.showSnackBar("Impossible d'ajouter plus de 5 fois cette offre");
      return;
    }

    const cartItemRequest: CartItemRequest = {
      offerId: offer.offerId,
      quantity: quantityToAdd,
      priceAtPurchase: offer.price ?? 0,
      cartId: cartId,
    };

    this.cartService.addOfferToCart(cartId, cartItemRequest).subscribe(() => {
      this.showSnackBar("L'offre a été ajoutée au panier");
    });
  }

  // Méthode pour mettre à jour la quantité d'une offre dans le panier
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }
}
