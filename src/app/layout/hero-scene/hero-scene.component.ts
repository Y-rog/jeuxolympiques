import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-scene',
  imports: [],
  templateUrl: './hero-scene.component.html',
  styleUrl: './hero-scene.component.css'
})
export class HeroSceneComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';

}
