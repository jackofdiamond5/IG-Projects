import { Component, OnInit, OnDestroy, EventEmitter, Output, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { ILogin } from '../interfaces/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, ILogin {
  username: string;
  password: string;

  public myUser: FormGroup;
  public myRegistration: FormGroup;
  private router: Router;

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;

  @Output() viewChange: EventEmitter<any> = new EventEmitter();
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  constructor(private oidcSecurityService: OidcSecurityService,
    private http: HttpClient, private authentication: AuthenticationService, private user: UserService, fb: FormBuilder) {
    this.isAuthorized = false;
    this.myUser = fb.group({
      id: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy() {
    this.isAuthorizedSubscription.unsubscribe();
  }

  signUp() {
    this.oidcSecurityService.authorize();
  }

  signOut() {
    this.oidcSecurityService.logoff();
  }

  callApi() {
    const token = this.oidcSecurityService.getToken();
    const apiURL = 'https://fabrikamb2chello.azurewebsites.net/hello';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, { headers: headers }).subscribe(
      response => this.apiResult = JSON.stringify(response),
      error => console.log(error));
  }

  tryLogin() {
    this.authentication
      .login(this.myUser.value)
      .subscribe(
        res => {
          debugger;
          if (res) {
            this.loggedIn.emit(this.myUser.value);
            // navigate to profile page
          }
        });
  }

  showRegistrationForm() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    loginForm.hidden = true;
    registrationForm.hidden = false;
    this.viewChange.emit('Register');
  }
}
