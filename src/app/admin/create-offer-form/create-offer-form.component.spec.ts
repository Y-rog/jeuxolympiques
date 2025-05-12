import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfferFormComponent } from './create-offer-form.component';

describe('CreateOfferFormComponent', () => {
  let component: CreateOfferFormComponent;
  let fixture: ComponentFixture<CreateOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOfferFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
