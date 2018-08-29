import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../interfaces/user-model.interface.';

@Component({
  template: '<p>Signing in...</p>'
})
export class RedirectComponent implements OnInit {

  private authentication: AuthenticationService;

  constructor(private oidcSecurityService: OidcSecurityService, private user: UserService) {
  }

  ngOnInit() {
    this.oidcSecurityService.authorizedCallback();
    this.oidcSecurityService.onAuthorizationResult.subscribe((x) => {
      this.oidcSecurityService.getUserData().subscribe(userData => {
        // tslint:disable-next-line:no-debugger
        debugger;

        this.authentication.login(userData as IUser);

        // userData.name;
        // userData.email;
        // userData.picture;
        sessionStorage.setItem('userName', userData.name);
        // this.user.setUser()
      });
      this.user.setToken(this.oidcSecurityService.getToken());
    });
  }
}
