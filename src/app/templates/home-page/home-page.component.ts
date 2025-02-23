import { Component } from '@angular/core';
import { HeroSceneComponent } from '../../layout/hero-scene/hero-scene.component';
import { MatButton } from '@angular/material/button';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [HeroSceneComponent, MatButton, RouterLink, RouterLinkActive],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  title: string = "Bienvenue aux Jeux Olympiques 2024";
  subtitle: string = "Rejoignez-nous pour célébrer l'esprit de l'olympisme avec les athlètes du monde entier !";

}
