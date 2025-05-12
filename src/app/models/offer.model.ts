export interface Offer {
    offerId: number | null;
    price: number;
    availability: boolean;
    eventId: number;
    eventTitle: string;
    eventLocation: string;
    eventDateTime: Date;
    offerCategoryId: number;
    offerCategoryTitle: string;
    offerCategoryPlacesPerOffer: number;
}
  