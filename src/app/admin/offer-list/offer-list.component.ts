import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Offer } from '../../models/offer.model';
import { OffersService } from '../../services/offers.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UpdateOfferPriceDialogComponent } from './update-offer-price-dialog/update-offer-price-dialog.component';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.css',
})
export class OfferListComponent implements OnInit {
  offersDataSource = new MatTableDataSource<Offer>();
  displayedColumns: string[] = [
    'offerCategoryTitle','eventTitle', 'eventLocation', 'eventDateTime','price', 'active', 'actions'
  ];

  sortValue: string = 'eventDateTime';
  sortOptions: string[] = ['eventDateTime', 'eventLocation', 'eventTitle', 'price', 'active', 'offerCategoryTitle'];

  data: { message: string } = { message: 'Default message' };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private offersService: OffersService
  ) {}

  ngOnInit(): void {
    this.offersService.getAllOffersForAdmin().subscribe((offers: Offer[]) => {
      offers.forEach(offer => {
      if (offer.active === undefined || offer.active === null) {
        offer.active = false;
      }
    });
      this.offersDataSource.data = offers;
      this.offersDataSource.sort = this.sort;
      if (this.paginator) {
        this.offersDataSource.paginator = this.paginator;
      }
      this.applySort();
    });
  }

  // Méthode pour appliquer le tri en fonction du choix du select
  onSortChange(): void {
    this.applySort(); // Appliquer le tri après sélection du critère
  }
  
  // Appliquer le tri basé sur la valeur de sortValue
  private applySort(): void {
    const sortHeader = this.sortValue;
  
    // Vérifier le critère de tri et appliquer le bon ordre
    this.offersDataSource.sortingDataAccessor = (data: Offer, header: string) => {
      switch (header) {
        case 'eventDateTime':
          return new Date(data.eventDateTime); 
        case 'eventLocation':
          return data.eventLocation;
        case 'eventTitle':
          return data.eventTitle;
        case 'price':
          return data.price;
        case 'active':
          return data.active ? 1 : 0; 
        case 'offerCategoryTitle':
          return data.offerCategoryTitle; 
        default:
          return (data as any)[header];
      }
    };
  
    // Réinitialiser le tri
    this.sort.active = sortHeader;
    this.sort.direction = 'asc'; // Par défaut, tri croissant
  
    // Appliquer le tri
    this.offersDataSource.sort = this.sort;
  }

  editOffer(offer: Offer): void {
    const dialogRef = this.dialog.open(UpdateOfferPriceDialogComponent, {
      data: { currentPrice: offer.price }
    });
     dialogRef.afterClosed().subscribe((newPrice: number) => {
      if (newPrice != null && newPrice !== offer.price) {
        const updatedOffer = { ...offer, price: newPrice };

        this.offersService.updateOffer(offer.offerId!, updatedOffer).subscribe({
          next: (updated) => {
            offer.price = updated.price;
            this.snackBar.open('Prix mis à jour avec succès.', 'Fermer', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la mise à jour du prix.', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteOffer(offer: Offer): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: { message: `Voulez-vous vraiment supprimer l\'offre ${offer.offerCategoryTitle}, ${offer.eventTitle} ?` }
  });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm' && offer.offerId) {
        this.offersService.deleteOffer(offer.offerId).subscribe({
          next: () => {
            this.snackBar.open('Offre supprimée avec succès !', 'Fermer', { duration: 2000 });
            this.offersDataSource.data = this.offersDataSource.data.filter(o => o.offerId !== offer.offerId);
          },
          error: () => {
            this.snackBar.open(
              'Erreur lors de la suppression de l\'offre. Vous ne pouvez supprimer une offre publiée ou déjà achetée.',
              'Fermer',
              { duration: 5000 }
            );
          }
        });
      }
    });
  }



  toggleActive(offer: Offer): void {
    if (!offer.offerId) return;
    this.offersService.toggleActive(offer.offerId).subscribe({
      next: (newStatus: boolean) => {
        offer.active = newStatus;
        this.snackBar.open(
          `Offre ${newStatus ? 'activée' : 'désactivée'} avec succès !`,
          'Fermer',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('Erreur lors du changement de statut.', 'Fermer', {
          duration: 2000,
        });
      },
    });
  }

}

