import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryOfferDialogComponent } from './create-category-offer-dialog.component';

describe('CreateCategoryOfferDialogComponent', () => {
  let component: CreateCategoryOfferDialogComponent;
  let fixture: ComponentFixture<CreateCategoryOfferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCategoryOfferDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCategoryOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
