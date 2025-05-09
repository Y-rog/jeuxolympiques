import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeroSceneComponent } from '../../layout/hero-scene/hero-scene.component';
import { CommonModule } from '@angular/common';
import { OffersService } from '../../services/offers.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Offer } from '../../models/offer.model';
import { CartService } from '../../services/cart.service';
import { CartItemRequest } from '../../models/cart-item-request';
import { MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [
    HeroSceneComponent,
    CommonModule,
    MatButtonModule,
    MatFormField, MatLabel, MatSelectModule, FormsModule,
    MatOption, MatTableModule,
    MatIcon,
    MatSortModule, MatCard
  ],
  templateUrl: './offers-page.component.html',
  styleUrls: ['./offers-page.component.css']
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

  isMobileView: boolean = false; // Variable pour savoir si on est en vue mobile

  constructor(
    private offersService: OffersService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver // Inject BreakpointObserver
  ) {
    // Écoute des changements de la taille de l'écran pour détecter si c'est une vue mobile
    this.breakpointObserver.observe('(max-width: 768px)')
      .subscribe(result => {
        this.isMobileView = result.matches; // Met à jour isMobileView selon la taille de l'écran
        this.applyFilter(); // Applique à nouveau le filtre lors du redimensionnement
      });

    // Récupération des offres et mise à jour des catégories
    this.offersService.getOffers().subscribe((data: Offer[]) => {
      this.offers.data = data;
      this.category = Array.from(new Set(data.map(o => o.offerCategoryTitle)));  // Catégories uniques
    });
  }

  ngAfterViewInit() {
    // Associer le MatSort pour le tri
    this.offers.sort = this.sort;
  }

  // Méthode de filtrage en fonction de la catégorie sélectionnée
  applyFilter() {
    const filterValue = this.selectedCategory.trim().toLowerCase();
  
    // En mode mobile, appliquer directement le filtre sur les offres
    if (this.isMobileView) {
      // Si aucune catégorie n'est sélectionnée, remettre toutes les offres
      if (!filterValue) {
        this.offersService.getOffers().subscribe((data: Offer[]) => {
          this.offers.data = data;  // Réinitialiser les offres
        });
      } else {
        // Appliquer le filtre sur les offres en fonction de la catégorie sélectionnée
        this.offersService.getOffers().subscribe((data: Offer[]) => {
          const filteredOffers = data.filter(offer =>
            offer.offerCategoryTitle.toLowerCase().includes(filterValue)
          );
          this.offers.data = filteredOffers;  // Mettre à jour les données filtrées
        });
      }
    } else {
      // En mode bureau, recréer le MatTableDataSource à chaque changement de filtre
      this.offersService.getOffers().subscribe((data: Offer[]) => {
        const filteredOffers = data.filter(offer =>
          !filterValue || offer.offerCategoryTitle.toLowerCase().includes(filterValue)
        );
        this.offers.data = filteredOffers;  // Réinitialisation des données filtrées
        this.offers.sort = this.sort; // Assurer que le tri est réappliqué après chaque mise à jour
      });
    }
  }

  // Méthode pour ajouter une offre au panier
  addToCart(offer: Offer): void {
    if (offer.offerId === null) {
      this.showSnackBar("L'identifiant de l'offre est invalide.");
      return;
    }

    // Vérification de la disponibilité avant d'ajouter l'offre au panier
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

      // Mise à jour de la disponibilité des offres
      this.offersService.updateOffersAvailabilityByEvent(offer.eventId).subscribe({
        next: () => console.log("Disponibilité mise à jour pour l'événement", offer.eventId),
        error: (err) => console.error("Erreur de mise à jour de disponibilité :", err)
      });
    });
  }

  // Ajout de l'élément au panier
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

  // Afficher un message via le snackBar
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }
}



