import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MyDTOptions } from 'src/app/helpers/MyDtOptions';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

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
  constructor(private httpClient: HttpClient) {}

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
