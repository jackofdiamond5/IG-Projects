import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExternalAuthProvider } from './igx-auth.service';
import { IUser } from '../interfaces/user-model.interface';
import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {
  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) {
    this.isAuthorized = false;
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy() {
    this.isAuthorizedSubscription.unsubscribe();
  }

  login(userData: IUser) {
    let data;
    this.http
      .post('/login', userData)
      .subscribe(
        suc => {
          data = suc;
        },
        fail => {
          alert(fail.error.message);
        }
      );

    return data;
  }

  public loginWith(userInfo: IUser, provider: ExternalAuthProvider) {
    return this.http.post('/extlogin', userInfo/*{ userInfo, provider }*/); // TODO: Add logic for multiple providers
  }

  register(userData: IUser) {
    let data;
    this.http
      .post('/register', userData)
      .subscribe(
        suc => {
          data = this.login(suc as IUser);
        },
        fail => {
          alert(fail.error.message);
        }
      );

    return data;
  }
}
