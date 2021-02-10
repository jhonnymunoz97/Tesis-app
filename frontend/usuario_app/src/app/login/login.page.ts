import { AuthService } from "./../services/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  loginForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      dni: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || "/";
  }

  login() {
    if (!this.loginForm.valid) {
    } else {
      this.authService;
      this.authService
        .login(this.loginForm.value.dni, this.loginForm.value.password)
        .pipe(first())
        .subscribe(
          (data) => {
            this.router.navigate([this.returnUrl]);
          },
          (error) => {
            this.error = error;
            this.loading = false;
          }
        );
    }
  }

  get errorControl() {
    return this.loginForm.controls;
  }
}
