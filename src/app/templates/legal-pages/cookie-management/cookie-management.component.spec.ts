import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieManagementComponent } from './cookie-management.component';

describe('CookieManagementComponent', () => {
  let component: CookieManagementComponent;
  let fixture: ComponentFixture<CookieManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
