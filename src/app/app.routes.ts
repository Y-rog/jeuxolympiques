import { Routes } from '@angular/router';
import { CartPageComponent } from './templates/cart-page/cart-page.component';
import { HomePageComponent } from './templates/home-page/home-page.component';
import { LoginPageComponent } from './templates/login-page/login-page.component';
import { OffersPageComponent } from './templates/offers-page/offers-page.component';

export const routes: Routes = [
    {path: 'home', component: HomePageComponent},
    {path: 'offers', component: OffersPageComponent},
    {path: 'cart', component: CartPageComponent}, 
    {path: 'login', component: LoginPageComponent},   
];
