import { NotAuthorizedComponent } from './components/shared/not-authorized/not-authorized.component';
import { AdminGuard } from './guards/admin.guard';
import { CarrerasComponent } from './components/admin/carreras/carreras.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'inicio', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'carreras',
    component: CarrerasComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: 'login', component: LoginComponent },

  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
    canActivate: [AuthGuard],
  },
  // otherwise redirect to home
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
