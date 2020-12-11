import { Response } from './../../models/response';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; // add this 1 of 4

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  usersLogged: User[] = [];
  constructor(private userService: UserService) {
    moment.locale('es-MX');
  }

  ngOnInit(): void {
    this.getLastLoggedUsers();
  }

  getLastLoggedUsers() {
    this.userService.getLastsLoggedUsers().subscribe((response: Response) => {
      response.data.forEach((user: User) => {
        this.usersLogged.push(user);
      });
    });
  }

  getRelativeTime(timestamp) {
    return moment(timestamp).startOf('minutes').fromNow();
  }
}
