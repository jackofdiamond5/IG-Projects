import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { User } from '../models/UserModel';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BackendInterceptor } from '../services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;
  interceptor: BackendInterceptor;

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

  login(userData: User) {
    return this.http.post('/login', userData);
    // return this.interceptor.intercept(new HttpRequest<User>('POST', '/login', userData), this.handler);
  }

  register(userData: User) {
    return this.http.post('/register', userData);
    // return this.interceptor.intercept(new HttpRequest<User>('POST', '/register', userData), this.handler);
  }
}
