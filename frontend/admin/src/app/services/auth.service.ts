import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(dni: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/login`, {
        dni,
        password,
      })
      .pipe(
        map((user) => {
          user.data.profilePhoto = user.data.profilePhoto
            ? user.data.profilePhoto
            : 'https://i.pravatar.cc/1000';
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.data));
          this.currentUserSubject.next(user.data);
          return user.data;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    try {
      this.http.post<any>(`${environment.apiUrl}/logout`, null);
    } catch (error) {}
    window.location.reload();
  }
}
