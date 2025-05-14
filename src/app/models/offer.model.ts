export interface Offer {
    offerId: number | null;
    price: number;
    availability: boolean;
    active: boolean | null;
    eventId: number;
    eventTitle: string;
    eventLocation: string;
    eventDateTime: Date;
    offerCategoryId: number;
    offerCategoryTitle: string;
    offerCategoryPlacesPerOffer: number;
}
  