import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Offer } from '../../models/offer.model';
import { OffersService } from '../../services/offers.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-offer-list',
  imports: [CommonModule, MatTableModule, MatSort, MatPaginator, MatIconModule, MatSlideToggleModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.css',
})
export class OfferListComponent implements OnInit {
  offersDataSource = new MatTableDataSource<Offer>();
  displayedColumns: string[] = [
    'offerCategoryTitle','eventTitle', 'eventLocation', 'eventDateTime','price', 'active', 'actions'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.offersService.getAllOffersForAdmin().subscribe((offers) => {
      offers.forEach(offer => {
      if (offer.active === undefined || offer.active === null) {
        offer.active = false;
      }
    });
      this.offersDataSource.data = offers;
      this.offersDataSource.sort = this.sort;
      this.offersDataSource.paginator = this.paginator;
    });
  }

  editOffer(offer: Offer): void {
    this.router.navigate(['/admin/update-offer', offer.offerId]);
  }

  deleteOffer(offer: Offer): void {
    if (!offer.offerId) return;
    this.offersService.deleteOffer(offer.offerId).subscribe({
      next: () => {
        this.snackBar.open('Offre supprimée !', 'Fermer', { duration: 2000 });
        this.offersDataSource.data = this.offersDataSource.data.filter(o => o.offerId !== offer.offerId);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression de l\'offre.', 'Fermer', { duration: 2000 });
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

