import { Routes } from '@angular/router';
import { CartPageComponent } from './templates/cart-page/cart-page.component';
import { HomePageComponent } from './templates/home-page/home-page.component';
import { LoginComponent } from './auth/login/login.component';
import { OffersPageComponent } from './templates/offers-page/offers-page.component';
import { PolicyConfidantialityComponent } from './templates/legal-pages/policy-confidantiality/policy-confidantiality.component';
import { CookieManagementComponent } from './templates/legal-pages/cookie-management/cookie-management.component';
import { CgvComponent } from './templates/legal-pages/cgv/cgv.component';
import { AdminComponent } from './admin/admin.component';
import { CreateEventFormComponent } from './admin/create-event-form/create-event-form.component';
import { EventListComponent } from './admin/event-list/event-list.component';
import { adminGuard } from './guards/admin.guard';
import { RegistrationComponent } from './auth/registration/registration.component';
import { UpdateEventFormComponent } from './admin/update-event-form/update-event-form.component';
import { CartSummarizePageComponent } from './templates/cart-summarize-page/cart-summarize-page.component';

export const routes: Routes = [
    {path: 'home', component: HomePageComponent},
    {path: 'offers', component: OffersPageComponent},
    {path: 'cart/:id', component: CartPageComponent},
    {path:'cart/:id/cart-summary', component: CartSummarizePageComponent}, 
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegistrationComponent},
    {path: 'policy-confidantiality', component: PolicyConfidantialityComponent},
    {path: 'cookie-management', component: CookieManagementComponent},
    {path: 'cgv', component: CgvComponent},
    {path: '', component: HomePageComponent},
    {path: 'admin', component: AdminComponent, canActivate: [adminGuard]}, 
    {path: 'admin/create-event', component: CreateEventFormComponent, canActivate: [adminGuard]},
    {path: 'admin/event-list', component: EventListComponent, canActivate: [adminGuard]},
    {path: 'admin/update-event/:id', component: UpdateEventFormComponent, canActivate: [adminGuard]},
];



