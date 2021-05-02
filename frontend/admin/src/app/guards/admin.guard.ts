import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const role = this.authenticationService.currentUserValue.role;
    if (role === 'Administrador') {
      // logged as Admin in so return true
      return true;
    }

    // not logged in as Admin so redirect to login page with the return url
    this.router.navigate(['/not-authorized'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
