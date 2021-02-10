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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err);
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          window.location.reload();
        }
        const error = err.error.messages || err.error.message || err.statusText;
        if (Array.isArray(error)) {
          return throwError(error);
        } else {
          return throwError([error]);
        }
      })
    );
  }
}