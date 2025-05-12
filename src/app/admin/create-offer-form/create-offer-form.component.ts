import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OfferCategoriesService } from '../../services/offer-categories.service';
import { OffersService } from '../../services/offers.service';
import { CreateCategoryOfferDialogComponent } from './create-category-offer-dialog/create-category-offer-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { OfferCategory } from '../../models/offer-category.model';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';



@Component({
  selector: 'app-create-offer-form',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatDialogModule, MatOptionModule, CommonModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './create-offer-form.component.html',
  styleUrl: './create-offer-form.component.css'
})
export class CreateOfferFormComponent implements OnInit {
  createOfferForm!: FormGroup;
  categories: OfferCategory[] = [];
  events: Event[] = []; 
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private offersService: OffersService,
    private offerCategoriesService: OfferCategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createOfferForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0.01)]],
      availability: [true, Validators.required],
      offerCategoryId: ['', Validators.required],
      eventId: ['', Validators.required],
    });
    this.loadCategories();
    this.loadEvents();
  }

  loadCategories() {
    this.offerCategoriesService.getAll().subscribe((categories) => (this.categories = categories));
  }

  loadEvents() {
    this.eventService.getEvents().subscribe((events) => (this.events = events));
  }

  openCategoryModal() {
    const dialogRef = this.dialog.open(CreateCategoryOfferDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCategories();
    });
  }

  onSubmit() {
    if (this.createOfferForm.valid) {
      this.offersService.createOffer(this.createOfferForm.value).subscribe({
        next: () => {
          this.successMessage = 'Offre créée avec succès.';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => this.errorMessage = 'Erreur lors de la création de l\'offre : ' + error,
      });
    }
  }
  

}
