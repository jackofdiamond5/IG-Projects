import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../interfaces/user-model.interface.';
import { ActivatedRoute } from '@angular/router';
import { ExternalAuthProvider, ExternalAuthService } from '../authentication/igx-auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  template: '<p>Signing in...</p>'
})
export class RedirectComponent implements OnInit {
  constructor(
    private user: UserService,
    private loginComponent: LoginComponent,
    private authService: AuthenticationService,
    private externalAuthService: ExternalAuthService,
    private oidcSecurityService: OidcSecurityService) {
    // const provider = route.data['provider'] as ExternalAuthProvider;
  }

  async ngOnInit() {
    const userInfo: IUser = await this.externalAuthService.getUserInfo(this.externalAuthService.googleConfig);
    // this.authService.loginWith(userInfo, route.data['provider'] as ExternalAuthProvider).subscribe();
    debugger;
    //TODO: in subscribe:
    userInfo.externalToken = this.oidcSecurityService.getToken();
    this.user.setCurrentUser(userInfo);
  }
}
