import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSceneComponent } from './hero-scene.component';

describe('HeroSceneComponent', () => {
  let component: HeroSceneComponent;
  let fixture: ComponentFixture<HeroSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
