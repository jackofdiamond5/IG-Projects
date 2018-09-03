import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ILogin } from '../interfaces/login.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Injector } from '@angular/core';
import { ExternalAuthService, ExternalAuthConfig, ExternalAuthProvider } from '../authentication/igx-auth.service';

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
  private router: Router;

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;

  @Output() viewChange: EventEmitter<any> = new EventEmitter();
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  constructor(private oidcSecurityService: OidcSecurityService, private authService: ExternalAuthService,
    private authentication: AuthenticationService, fb: FormBuilder, private injector: Injector
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
    this.authService.Login(this.authService.googleConfig);
  }

  // signUpFb() {
  //   debugger;
  //   FB.login((result: any) => {
  //     this.getUser();
  //   });
  // }

  getUser() {
    // FB.api('/me?fields=id,name,first_name,gender,picture,email,friends',
    // function(result) {
    //     if (result && !result.error) {
    //       debugger;
    //       // result.email
    //       // result.name
    //       // result.picture.data.url
    //     } else {
    //         console.log(result.error);
    //     }
    // });
  }

  signOut() {
    this.oidcSecurityService.logoff();
  }

  tryLogin() {
    this.authentication
      .login(this.user.value)
      .subscribe(
        res => {
          if (res) {
            this.router = this.injector.get(Router);
            this.loggedIn.emit(this.user.value);
            this.router.navigate(['/profile']);
          }
        },
        res => {
          if (res.error) {
            alert(res.error.message);
          }
        }
      );
  }

  showRegistrationForm() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    loginForm.hidden = true;
    registrationForm.hidden = false;
    this.viewChange.emit('Register');
  }
}
