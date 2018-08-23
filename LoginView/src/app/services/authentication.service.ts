import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { LoginResultModel } from '../models/LoginResultModel';
import { User } from '../models/UserModel';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;

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

  //signUp() {
  //  this.oidcSecurityService.authorize();
  //}

  //logout() {
  //  this.oidcSecurityService.logoff();
  //}

  //callApi() {
  //  const token = this.oidcSecurityService.getToken();
   // const apiURL = 'https://fabrikamb2chello.azurewebsites.net/hello';
   // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//
   // this.http.get(apiURL, { headers: headers }).subscribe(
   //     response => this.apiResult = JSON.stringify(response),
   //     error => console.log(error));
  //}

  login(email: string, password: string): Observable<LoginResultModel> {
    return this.http.post<LoginResultModel>('https://reqres.in/api/login', {
      email: email,
      password: password
    });
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<User> {
    return this.http.post<User>('https://reqres.in/api/register', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    });
  }
}
