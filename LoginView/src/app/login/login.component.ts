import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';

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

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;

  @Output() viewChange: EventEmitter<any> = new EventEmitter();

  constructor(private oidcSecurityService: OidcSecurityService, private http: HttpClient, private authentication: AuthenticationService, private user: UserService, fb: FormBuilder) {
    this.isAuthorized = false;
    
    this.myUser = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.myRegistration = fb.group({
      newEmail: ['', Validators.required],
      newPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
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

  tryLogIn() {
    this.authentication.login(
      this.username,
      this.password
    )
      .subscribe(
        r => {
          if (r.token) {
            const msgSuccess = document.getElementById('successMsg');
            const msgHello = document.getElementById('helloMsg');
            const form = document.getElementById('loginForm');

            this.user.setToken(r.token);
            msgHello.textContent = 'Hello, ' + this.username + '! You have successfully logged in! ';
            form.hidden = true;
            msgSuccess.hidden = false;
          }
        },
        r => {
          alert(r.error.error);
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
