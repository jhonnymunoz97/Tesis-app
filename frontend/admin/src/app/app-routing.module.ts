import { DriversLiveComponent } from './components/admin/drivers-live/drivers-live.component';
import { DriversComponent } from './components/admin/drivers/drivers.component';
import { NotAuthorizedComponent } from './components/shared/not-authorized/not-authorized.component';
import { AdminGuard } from './guards/admin.guard';
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
    path: 'drivers',
    component: DriversComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'drivers-live',
    component: DriversLiveComponent,
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
