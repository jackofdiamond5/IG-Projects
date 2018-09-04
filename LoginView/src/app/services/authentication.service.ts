import { Subscription, throwError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user-model.interface.';
import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {
  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;
  currentUser: IUser;

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

  get loggedInUser(): IUser {
    const formData = JSON.parse(localStorage.getItem('currentUser'));
    if (formData) {
      this.currentUser = JSON.parse(localStorage.getItem('users')).filter(u => u.username === formData.username);
    }
    return this.currentUser;
  }

  login(userData: IUser) {
    let data;
    this.http
      .post('/login', userData)
      .subscribe(
        suc => {
          debugger;
          data = suc;
        },
        err => {
          alert(err.error.message);
        }
      );

    return data;
  }

  register(userData: IUser) {
    let data;
    this.http
    .post('/register', userData)
    .subscribe(
      suc => {
        data = this.login(suc as IUser);
      },
      err => {
        alert(err.error.message);
      }
    );

    return data;
  }
}
