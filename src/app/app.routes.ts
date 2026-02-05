import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { ListadoClienteComponent } from './admin/gestionCliente/listado-cliente/listado-cliente';
import { EditarClienteComponent } from './admin/gestionCliente/editar-cliente/editar-cliente';
import { HomeAdmin } from './admin/home-admin/home-admin';
import { ListadoComponent } from './admin/gestionCurso/listado/listado';
import { InsertCourse } from './admin/gestionCurso/crear/InsertCourse';
import { EditCourse } from './admin/gestionCurso/editar/EditCourse';
import { DetailCourse } from './admin/gestionCurso/detalle/DetailCourse';
import { DashboardClient } from './client/dashboard-client/dashboard-client';
import { HomeClient } from './client/home-client/home-client';
import { CursoComponent } from './client/curso/curso';
import { PlansComponent } from './client/plans/plans';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
  path: 'client',
  component: DashboardClient,
  canActivate: [authGuard],
  children: [

    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', component: HomeClient },

    { path: 'curso', component: CursoComponent },

    { path: 'plans', component: PlansComponent }
  ]
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
      { path: 'gestionCliente/editar/:email', component: EditarClienteComponent },

      { path: 'gestionCurso/listado', component: ListadoComponent },
      { path: 'gestionCurso/crear', component: InsertCourse },
      { path: 'gestionCurso/editar/:id', component: EditCourse },
      { path: 'gestionCurso/detalle/:id', component: DetailCourse }
    ]
  }
];
