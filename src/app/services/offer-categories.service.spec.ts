import { TestBed } from '@angular/core/testing';

import { OfferCategoriesService } from './offer-categories.service';

describe('OfferCategoryService', () => {
  let service: OfferCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
