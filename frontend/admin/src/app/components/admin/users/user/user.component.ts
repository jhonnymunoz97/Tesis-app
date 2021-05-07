import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Driver } from 'src/app/models/driver';
import { Image } from 'src/app/models/image';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  title: string = 'Usuarios';
  roleShow: string = 'user';

  isEditOrAdd: boolean = false;
  user: User | Driver;
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.id == 'new') {
        this.user = new User();
        this.isEditOrAdd = true;
      } else {
        this.getUser(params.id);
      }
    });
  }

  getUser(id: number) {
    this.httpClient
      .get<User[]>(environment.apiUrl + '/users/' + id)
      .subscribe((data) => {
        this.user = (data as any).data;
        this.user.profilePhoto = this.user.profilePhoto
          ? this.user.profilePhoto
          : 'https://i.pravatar.cc/1000';
      });
  }

  saveUser() {
    this.isEditOrAdd = false;

    if (this.user.id) {
      this.httpClient
        .put<User>(
          environment.apiUrl + '/users' + '/' + this.user.id,
          this.user
        )
        .subscribe((data) => {
          const user: User = (data as any).data;
          if (user.id == this.authService.currentUserValue.id) {
            this.authService.logout();
          }
          this.router.navigate(['/users']);
        });
    } else {
      this.httpClient
        .post<Driver>(environment.apiUrl + '/users', this.user)
        .subscribe((data) => {
          const user: User = (data as any).data;
          if (user.id == this.authService.currentUserValue.id) {
            this.authService.logout();
          }
          this.router.navigate(['/users']);
        });
    }
  }

  onSelectPhoto(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        this.httpClient
          .post(
            environment.apiUrl + '/upload64',
            { imagen: event.target.result as string },
            {
              responseType: 'text',
            }
          )
          .subscribe((data) => {
            this.user.profilePhoto = data;
          });
      };
    }
  }

  onSelectLicense(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        this.httpClient
          .post(
            environment.apiUrl + '/upload64',
            { imagen: event.target.result as string },
            {
              responseType: 'text',
            }
          )
          .subscribe((data) => {
            this.user.license = data;
          });
      };
    }
  }

  editUser() {
    this.isEditOrAdd = true;
  }
}
