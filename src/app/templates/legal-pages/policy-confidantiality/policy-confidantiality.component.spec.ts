import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyConfidantialityComponent } from './policy-confidantiality.component';

describe('PolicyConfidantialityComponent', () => {
  let component: PolicyConfidantialityComponent;
  let fixture: ComponentFixture<PolicyConfidantialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyConfidantialityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyConfidantialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
