import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

import { ILogin } from '../interfaces/login.interface';
import { UserService } from '../services/user.service';
import { ExternalAuthService } from '../services/igx-auth.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, ILogin {
  username: string;
  password: string;

  public user: FormGroup;
  public myRegistration: FormGroup;

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;

  @Output() viewChange: EventEmitter<any> = new EventEmitter();
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  constructor(private oidcSecurityService: OidcSecurityService, private authService: ExternalAuthService,
    private authentication: AuthenticationService, fb: FormBuilder, private userService: UserService, private router: Router
  ) {
    this.isAuthorized = false;
    this.user = fb.group({
      id: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy() {
    this.isAuthorizedSubscription.unsubscribe();
  }

  signUpG() {
    this.authService.login(this.authService.googleConfig);
  }

  signOut() {
    this.oidcSecurityService.logoff();
  }

  tryLogin() {
    const response = this.authentication.login(this.user.value);
    if (response) {
      this.userService.setCurrentUser(response);
      this.router.navigate(['/profile']);
      this.loggedIn.emit();
    }
  }

  showRegistrationForm() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    loginForm.hidden = true;
    registrationForm.hidden = false;
    this.viewChange.emit();
  }
}
