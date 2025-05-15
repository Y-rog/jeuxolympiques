import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-event-list',
  imports: [MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, MatIconModule, NgIf],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  eventsDataSource: MatTableDataSource<Event> = new MatTableDataSource<Event>();
  displayedColumns: string[] = ['eventTitle', 'eventDescription', 'eventLocation', 'eventDateTime', 'eventPlacesNumber', 'actions'];

  sortValue: string = 'eventDateTime'; // Valeur par défaut du tri
  sortOptions: string[] = ['eventDateTime', 'eventLocation', 'eventTitle'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private eventService: EventService, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Récupérer les événements du service
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.eventsDataSource.data = events;
      this.eventsDataSource.sort = this.sort;
      if (this.paginator) {
        this.eventsDataSource.paginator = this.paginator; // Pagination
      }
      this.applySort(); // Appliquer le tri initial
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
    this.eventsDataSource.sortingDataAccessor = (data: Event, header: string) => {
      switch (header) {
        case 'eventDateTime':
          return new Date(data.eventDateTime); // Tri par date
        case 'eventLocation':
          return data.eventLocation; // Tri par lieu
        case 'eventTitle':
          return data.eventTitle; // Tri par titre
        default:
          return (data as any)[header];
      }
    };

    // Réinitialiser le tri
    this.sort.active = sortHeader;
    this.sort.direction = 'asc'; // Par défaut, tri croissant

    // Appliquer le tri
    this.eventsDataSource.sort = this.sort;
  }

  // Méthode pour modifier un événement
  editEvent(event: Event): void {
    console.log('Modification de l\'événement :', event);
    // Rediriger vers le formulaire de mise à jour avec l'ID de l'événement
    this.router.navigate(['/admin/update-event', event.eventId]); // Rediriger vers le formulaire de mise à jour
  }

  // Ouvrir la modal de confirmation de suppression
  openDeleteDialog(event: Event): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: `Êtes-vous sûr de vouloir supprimer l'événement "${event.eventTitle}" ?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteEvent(event);
      }
    });
  }
  
  

  // Méthode pour supprimer un événement
  deleteEvent(event: Event): void {
    if (!event.eventId) {
      this.snackBar.open('L\'événement ne peut pas être supprimé (ID invalide).', 'Fermer', { duration: 2000 });
      return;
    }
    this.eventService.deleteEventById(event.eventId).subscribe({
      next: () => {
        this.snackBar.open('Événement supprimé!', 'Fermer', { duration: 2000 });
        this.eventsDataSource.data = this.eventsDataSource.data.filter(e => e.eventId !== event.eventId);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression de l\'événement.', 'Fermer', { duration: 2000 });
      }
    });
  }
}





