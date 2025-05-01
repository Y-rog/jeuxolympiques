import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSummarizePageComponent } from './cart-summarize-page.component';

describe('CartSummarizePageComponent', () => {
  let component: CartSummarizePageComponent;
  let fixture: ComponentFixture<CartSummarizePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummarizePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartSummarizePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
