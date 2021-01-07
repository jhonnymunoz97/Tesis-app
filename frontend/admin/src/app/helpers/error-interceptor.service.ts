import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 500) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          window.location.reload();
        } else if (err.status === 403) {
          this.router.navigate(['/not-authorized']);
        }
        let error = err.error.messages || err.error.message || err.statusText;
        if (!Array.isArray(error)) {
          error = [error];
        }
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error',
          html: error.reduce((html, item) => {
            return html + item + '<br/>';
          }, ''),
          showConfirmButton: false,
          timer: 2500,
          width: 300,
        });
        return throwError(error);
      })
    );
  }
}
