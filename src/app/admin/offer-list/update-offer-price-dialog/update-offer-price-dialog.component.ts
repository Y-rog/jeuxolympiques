import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent,MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-offer-price-dialog',
  imports: [MatDialogContent, MatButton, CommonModule, MatInputModule, MatFormFieldModule, MatDialogActions, FormsModule],
  templateUrl: './update-offer-price-dialog.component.html',
  styleUrl: './update-offer-price-dialog.component.css'
})
export class UpdateOfferPriceDialogComponent {
  newPrice: number;

  constructor(
    public dialogRef: MatDialogRef<UpdateOfferPriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentPrice: number }
  ) {
    this.newPrice = data.currentPrice;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.newPrice);
  }
}
