import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  data: any;

  constructor(private sv: AuthService) {}

  ngOnInit(): void {}

  test() {
    this.sv
      .test()
      .pipe(first())
      .subscribe((data) => {
        console.log(data);
        this.data = data;
      });
  }
  logout() {
    this.sv.logout();
  }
}
