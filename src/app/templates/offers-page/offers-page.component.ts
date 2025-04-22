import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { HeroSceneComponent } from '../../layout/hero-scene/hero-scene.component';
import { CommonModule } from '@angular/common';
import { OffersService } from '../../services/offers.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField } from '@angular/material/form-field';
import { MatHeaderCell, MatTableDataSource, MatHeaderRow, MatRowDef, MatRow, MatCell, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Offer } from '../../models/offer.model';
import { CartService } from '../../services/cart.service';
import { CartItemRequest } from '../../models/cart-item-request';

@Component({
  selector: 'app-offers-page',
  imports: [HeroSceneComponent, CommonModule, MatButtonModule, MatRow, MatRowDef, MatFormField, MatLabel, MatSelect, FormsModule, MatOption, MatTableModule, MatCell, MatHeaderCell, MatIcon, MatHeaderRow, MatSortModule],
  templateUrl: './offers-page.component.html',
  styleUrl: './offers-page.component.css'
  
})
export class OffersPageComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  offers =new MatTableDataSource<Offer>();

  ngAfterViewInit() {
    this.offers.sort = this.sort;
  }

  loadOffers(data: Offer[]) {
    this.offers.data = data;
  }
  
  title: string = "Les Offres";
  subtitle: string = "Bénéficiez de nos réductions avec les formules Duo et Familliale !";
  category: string[] = [];
  filteredOffers: Offer[] = [];
  selectedCategory: string = '';

displayedColumns: string[] = ['eventTitle', 'eventDateTime', 'eventLocation', 'price', 'availability','quantity', 'action'];

// Injecter les valeurs du service dans le constructeur
constructor(private offersService: OffersService, private cartService: CartService) {
  this.offersService.getOffers().subscribe((data: Offer[]) => {
    this.offers.data = data;
    this.category = Array.from(new Set(data.map(offer => offer.offerCategoryTitle))); 
    this.filteredOffers = data;
  });
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
  
  
  addToCart(offer: any): void {
    const cartItemRequest: CartItemRequest = {
      offerId: offer.offerId,
      quantity: offer.quantity ?? 1,
      priceAtPurchase: offer.price ?? 0,
      cartId: offer.cartId ?? 0,
    };
    this.cartService.getCart().subscribe((cart) => {
      if (!cart) {
        this.cartService.createCart().subscribe((newCart) => {
          this.cartService.addOfferToCart(newCart.cartId, cartItemRequest).subscribe(() => {
          });
        });
      } else {
        this.cartService.addOfferToCart(cart.cartId, cartItemRequest).subscribe(() => {
        });
      }
    });
  }
  
  
}
