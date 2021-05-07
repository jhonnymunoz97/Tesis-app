import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MyDTOptions } from 'src/app/helpers/MyDtOptions';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  users: User[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  title: string;
  roleShow: string;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((data: any) => {
        switch (data.url.split('/')[1]) {
          case 'users':
            this.title = 'Usuarios';
            this.roleShow = 'Usuario';
            break;
          case 'admins':
            this.title = 'Administradores';
            this.roleShow = 'Administrador';
            break;
          case 'drivers':
            this.title = 'Conductores';
            this.roleShow = 'Conductor';
            break;
          default:
            this.title = 'Usuarios';
            this.roleShow = 'Usuario';
            break;
        }
      });
  }

  ngOnInit(): void {
    this.dtOptions = MyDTOptions;
    this.getUsers();
  }

  getUsers() {
    this.httpClient
      .get<User[]>(environment.apiUrl + '/users')
      .subscribe((data) => {
        this.users = (data as any).data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
