import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent implements OnInit {
  environment = environment;
  constructor() {}

  ngOnInit(): void {}
}
