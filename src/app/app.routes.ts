import { Routes } from '@angular/router';
import { CartPageComponent } from './templates/cart-page/cart-page.component';
import { HomePageComponent } from './templates/home-page/home-page.component';
import { LoginPageComponent } from './templates/login-page/login-page.component';
import { OffersPageComponent } from './templates/offers-page/offers-page.component';
import { PolicyConfidantialityComponent } from './templates/legal-pages/policy-confidantiality/policy-confidantiality.component';
import { CookieManagementComponent } from './templates/legal-pages/cookie-management/cookie-management.component';
import { CgvComponent } from './templates/legal-pages/cgv/cgv.component';
import { AdminComponent } from './admin/admin.component';
import { CreateEventFormComponent } from './admin/create-event-form/create-event-form.component';

export const routes: Routes = [
    {path: 'home', component: HomePageComponent},
    {path: 'offers', component: OffersPageComponent},
    {path: 'cart', component: CartPageComponent}, 
    {path: 'login', component: LoginPageComponent},
    {path: 'policy-confidantiality', component: PolicyConfidantialityComponent},
    {path: 'cookie-management', component: CookieManagementComponent},
    {path: 'cgv', component: CgvComponent},
    {path: '', component: HomePageComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'admin/create-event', component: CreateEventFormComponent},
];



