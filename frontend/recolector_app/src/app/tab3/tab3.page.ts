import { User } from "./../models/user";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  name: string;
  user: User;
  constructor(protected authService: AuthService) {}
  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.name =
      this.authService.currentUserValue.name +
      " " +
      this.authService.currentUserValue.surname;
    console.log(this.user);
  }
}
