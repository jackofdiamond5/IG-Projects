import {
  AuthModule,
  OidcConfigService,
} from 'angular-auth-oidc-client';
import {
  IgxDialogModule, IgxIconModule,
  IgxInputGroupModule, IgxButtonModule
} from 'igniteui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from '../services/auth.guard';
import { LoginComponent } from '../login/login.component';
import { JwtInterceptor } from '../services/jwt.interceptor';
import { BackendProvider } from '../services/fake-backend.service';
import { ProfileComponent } from '../profile/profile.component';
import { RegisterComponent } from '../register/register.component';
import { RedirectComponent } from '../redirect/redirect.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ExternalAuthProvider, ExternalAuthConfig, ExternalAuthService } from '../services/igx-auth.service';
import { AuthenticationRoutingModule } from './authentication-routing.module';

// Set the port to the one used by the server
export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => Promise.resolve();
}

@NgModule({
  imports: [
    CommonModule,
    AuthModule.forRoot(),
    IgxDialogModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule
  ],
  declarations: [
    LoginComponent,
    RedirectComponent,
    RegisterComponent,
    LoginDialogComponent,
    ProfileComponent
  ],
  providers: [
    AuthGuard,
    LoginComponent,
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    },
    // DELETE THIS BEFORE PRODUCTION!
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    BackendProvider
  ],
  exports: [
    LoginComponent,
    RedirectComponent,
    RegisterComponent,
    LoginDialogComponent,
    ProfileComponent
  ]
})
export class AuthenticationModule {
  constructor(private externalAuthService: ExternalAuthService) {
    this.externalAuthService.addGoogle({
      provider: ExternalAuthProvider.Google,
      stsServer: 'https://accounts.google.com',
      client_id: '332873309781-hdl40a54jlslod30f7g7j05s7m6tnc68.apps.googleusercontent.com',
      scope: 'openid email profile',
      redirect_url: 'http://localhost:4200/redirect-google', // TODO: Use <app root URL>/redirect, from router?
      response_type: 'id_token token',
      post_logout_redirect_uri: '/',
      post_login_route: 'redirect',
      auto_userinfo: false,
      max_id_token_iat_offset_allowed_in_seconds: 30
    });

    this.externalAuthService.addMicrosoft({
      provider: ExternalAuthProvider.Microsoft,
      stsServer: 'https://login.microsoftonline.com/consumers/v2.0/',
      client_id: 'a46659f7-d6ca-4353-86f0-0a3e14acb47b',
      scope: 'openid email profile',
      redirect_url: 'http://localhost:4200/redirect-microsoft', // TODO: Use <app root URL>/redirect, from router?
      response_type: 'id_token token',
      post_logout_redirect_uri: '/',
      post_login_route: '',
      auto_userinfo: false,
      max_id_token_iat_offset_allowed_in_seconds: 1000
    });

    this.externalAuthService.addFacebook({
      client_id: '329678091107847'
    } as ExternalAuthConfig);
  }
 }
