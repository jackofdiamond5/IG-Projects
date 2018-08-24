import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { LoginResultModel } from '../models/LoginResultModel';
import { User } from '../models/UserModel';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BackendInterceptor, backendProvider } from '../services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;
  interceptor: BackendInterceptor;

  constructor(private http: HttpClient, private handler: HttpHandler, private oidcSecurityService: OidcSecurityService) {
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
    // debugger;
    return this.interceptor.intercept(new HttpRequest<User>('POST', '/login', userData), this.handler);
  }

  register(userData: User) {
    // debugger;
    return this.interceptor.intercept(new HttpRequest<User>('POST', '/register', userData), this.handler);
  }

  // login(user): Observable<LoginResultModel> {
  //   if (!localStorage.getItem(user.email)) {
  //     alert('User does not exist!');
  //     return this.http.post<LoginResultModel>('https://reqres.in/api/login', {});
  //   }
  //   if (localStorage.getItem(user.email) === user.password) {
  //     localStorage.setItem('loggedInUser', JSON.stringify(user));
  //     return this.http.post<LoginResultModel>('https://reqres.in/api/login', {
  //       email: user.email,
  //       password: user.password
  //     });
  //   }

  //   alert('Wrong password!');
  //   return this.http.post<LoginResultModel>('https://reqres.in/api/login', {});
  // }

  // register(user: User): Observable<User> {
  //   if (localStorage.getItem(user.username)) {
  //     alert('User already exists!');
  //     return this.http.post<User>('https://reqres.in/api/register', {});
  //   }

  //   localStorage.setItem(user.username, user.password);
  //   return this.http.post<User>('https://reqres.in/api/register', {
  //     email: user.username,
  //     password: user.password
  //   });
  // }
}
