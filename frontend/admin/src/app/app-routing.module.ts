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
import { RoutesComponent } from './components/admin/routes/routes.component';
import { NewRouteComponent } from './components/admin/new-route/new-route.component';
import { MonitoreoComponent } from './components/admin/monitoreo/monitoreo.component';
import { UsersComponent } from './components/admin/users/users.component';
import { User } from './models/user';
import { UserComponent } from './components/admin/users/user/user.component';
import { MarkersComponent } from './components/admin/markers/markers.component';
import { RouteAssignComponent } from './components/admin/route-assign/route-assign.component';
import { ReportsComponent } from './components/admin/reports/reports.component';
import { VehiclesComponent } from './components/admin/vehicles/vehicles.component';
import { VehicleEditComponent } from './components/admin/vehicles/vehicle-edit/vehicle-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'inicio', component: HomeComponent, canActivate: [AuthGuard] },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'users/:id',
    component: UserComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admins',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admins/:id',
    component: UserComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'drivers',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'drivers/:id',
    component: UserComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'drivers-live',
    component: DriversLiveComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'vehicles',
    component: VehiclesComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'vehicles/:id',
    component: VehicleEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'monitoreo',
    component: MonitoreoComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'routes',
    component: RoutesComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'route-assign',
    component: RouteAssignComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'new-route',
    component: NewRouteComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'markers',
    component: MarkersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'reports',
    component: ReportsComponent,
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
