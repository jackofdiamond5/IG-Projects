import { Subscription, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user-model.interface.';
import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

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
    debugger;
    return this.http.post('/login', userData);
  }

  register(userData: IUser) {
    return this.http.post('/register', userData);
  }
}
