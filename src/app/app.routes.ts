import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './pages/home/home';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { ListadoClienteComponent } from './admin/gestionCliente/listado-cliente/listado-cliente';
import { EditarClienteComponent } from './admin/gestionCliente/editar-cliente/editar-cliente';
import { HomeAdmin } from './admin/home-admin/home-admin';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HomeAdmin },
      { path: 'gestionCliente', component: ListadoClienteComponent },
      { path: 'gestionCliente/editar/:email', component: EditarClienteComponent }
    ]
  }
];