import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  IgxNavigationDrawerModule, IgxNavbarModule,
  IgxLayoutModule, IgxRippleModule,
  IgxInputGroupModule, IgxIconModule,
  IgxDialogModule, IgxDropDownModule,
  IgxButtonModule, IgxToggleModule
} from 'igniteui-angular';

import {
  AuthModule,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
  OidcConfigService,
  AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { IgxCategoryChartModule } from 'igniteui-angular-charts/ES5/igx-category-chart-module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { RedirectComponent } from './redirect/redirect.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { BackendProvider } from './services/backend.service';
import { AuthGuard } from './services/auth.guard';

// Set the port to the one used by the server
export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => oidcConfigService.load_using_stsServer('https://accounts.google.com');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogComponent,
    DropDownComponent,
    CategoryChartComponent,
    LoginComponent,
    RedirectComponent,
    RegisterComponent,
    LoginDialogComponent,
    ProfileComponent,
    ForbiddenComponent,
    UnauthorizedComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(),
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxInputGroupModule, IgxIconModule,
    IgxDialogModule,
    IgxDropDownModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxCategoryChartModule
  ],
  providers: [
    AuthGuard,
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    BackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService,
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
      openIDImplicitFlowConfiguration.stsServer =
        'https://accounts.google.com';
      openIDImplicitFlowConfiguration.redirect_url = 'http://localhost:4200/profile';
      // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer
      // identified by the iss (issuer) Claim as an audience.
      // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
      // or if it contains additional audiences not trusted by the Client.
      openIDImplicitFlowConfiguration.client_id = '332873309781-hdl40a54jlslod30f7g7j05s7m6tnc68.apps.googleusercontent.com';
      openIDImplicitFlowConfiguration.response_type = 'id_token token';
      openIDImplicitFlowConfiguration.scope = 'openid email profile';
      openIDImplicitFlowConfiguration.post_logout_redirect_uri = '/';
      openIDImplicitFlowConfiguration.post_login_route = '/profile';
      // HTTP 403
      openIDImplicitFlowConfiguration.forbidden_route = '/forbidden';
      // HTTP 401
      openIDImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
      openIDImplicitFlowConfiguration.auto_userinfo = false;
      // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
      // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 30;

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    });

    console.log('APP STARTING');
  }
}
