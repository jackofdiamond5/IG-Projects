import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../interfaces/user-model.interface.';
import { ActivatedRoute } from '@angular/router';
import { ExternalAuthProvider, ExternalAuthService } from '../authentication/igx-auth.service';

@Component({
  template: '<p>Signing in...</p>'
})
export class RedirectComponent implements OnInit {

  private authentication: AuthenticationService;

  constructor(private oidcSecurityService: OidcSecurityService, private user: UserService,
              route: ActivatedRoute, private authService: ExternalAuthService) {
    // tslint:disable-next-line:no-debugger
    // debugger;
    // const provider = route.data['provider'] as ExternalAuthProvider;
  }

  ngOnInit() {
    debugger;
    this.authService.Login(this.authService.googleConfig);

    this.oidcSecurityService.authorizedCallback();
    this.oidcSecurityService.onAuthorizationResult.subscribe(() => {
      this.oidcSecurityService.getUserData().subscribe(userData => {
        // tslint:disable-next-line:no-debugger
        debugger;

        this.authentication.login(userData as IUser);

        // userData.name;
        // userData.email;
        // userData.picture;
        // sessionStorage.setItem('userName', userData.name);
        // this.user.setUser()
      });
      this.user.setToken(this.oidcSecurityService.getToken());
    });
  }
}
