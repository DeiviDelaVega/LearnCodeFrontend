import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './pages/home/home';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  }
];