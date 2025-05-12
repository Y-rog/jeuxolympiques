import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OfferCategoriesService } from '../../../services/offer-categories.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-category-offer-dialog',
  imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule, CommonModule],
  templateUrl: './create-category-offer-dialog.component.html',
  styleUrl: './create-category-offer-dialog.component.css'
})
export class CreateCategoryOfferDialogComponent {
  categoryForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryOfferDialogComponent>,
    private offerCategoriesService: OfferCategoriesService
  ) {
    this.categoryForm = this.fb.group({
      title: ['', Validators.required],
      placesPerOffer: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onCreate() {
    if (this.categoryForm.valid) {
      this.offerCategoriesService.createCategory(this.categoryForm.value).subscribe({
        next: (category) => {
          this.dialogRef.close(category);
        },
        error: () => this.errorMessage = 'Une erreur est survenue lors de la création de la catégorie.',
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
