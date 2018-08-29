import { Subscription, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user-model.interface.';
import { BackendInterceptor } from './fake-backend.service';
import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;
  interceptor: BackendInterceptor;
  currentUser: IUser;

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) {
    this.isAuthorized = false;
    this.interceptor = new BackendInterceptor();
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
    this.currentUser = JSON.parse(localStorage.getItem('users')).filter(u => u.name === formData.username);
    return this.currentUser;
  }

  login(userData: IUser) {
    this.setCurrentUser(userData);
    return this.http.post('/login', userData);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  register(userData: IUser) {
    return this.http.post('/register', userData);
  }

  // set current user in LS
  private setCurrentUser(user: IUser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }
}
