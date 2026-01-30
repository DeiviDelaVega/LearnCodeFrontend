import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './pages/home/home';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './admin/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    data: { role: 'ADMIN' }, 
    component: DashboardComponent
  }
];