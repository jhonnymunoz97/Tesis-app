import { environment } from './../../../../environments/environment';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  environment = environment;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
