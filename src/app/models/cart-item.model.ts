// cart-item.model.ts
export interface CartItem {
  cartItemId: number,
  quantity: number,
  qrcode: string,
  priceAtPurchase: number,
  offerId: number,
  addedAt: Date,
  expirationTime: string | Date;
  isExpired?: boolean;
  timeRemaining?: number;
  
}
  