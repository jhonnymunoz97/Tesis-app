import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let messages = event.body.messages ? event.body.messages : [];
          let msj = [];
          messages.forEach((message) => {
            if (message != 'Operación exitosa!') {
              msj.push(message);
            }
          });
          if (msj.length > 0) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Operación exitosa',
              html: msj.reduce((html, item) => {
                console.log(item);

                return html + item + '<br/>';
              }, ''),
              showConfirmButton: false,
              timer: 5000,
              width: 300,
            });
          }

          return event;
        }
      }),
      catchError((err) => {
        if (err.status === 401 || err.status === 500) {
          Swal.fire({
            allowOutsideClick: false,
            position: 'center',
            icon: 'warning',
            title: 'Tu sesión expiró, debes iniciar sesión de nuevo',
            showConfirmButton: false,
            timer: 2500,
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();
              window.location.reload();
            }
          });
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
          timer: 5000,
          width: 300,
        });
        return throwError(error);
      })
    );
  }
}
