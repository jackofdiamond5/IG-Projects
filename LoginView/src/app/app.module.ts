import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  IgxLayoutModule, IgxRippleModule,
  IgxNavigationDrawerModule, IgxNavbarModule
} from 'igniteui-angular';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ExternalAuthService } from './authentication/services/igx-auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    // NOTE: `AuthenticationModule` defines child routes, must be imported before root `AppRoutingModule`
    AuthenticationModule,
    AppRoutingModule,
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private externalAuthService: ExternalAuthService) {
    /**
     * Un-comment one or more of the following providers and and you service provider Client ID.
     * See <WIKI LINK> for more.
     */
    this.externalAuthService.addGoogle('332873309781-hdl40a54jlslod30f7g7j05s7m6tnc68.apps.googleusercontent.com');

    this.externalAuthService.addMicrosoft('a46659f7-d6ca-4353-86f0-0a3e14acb47b');

    this.externalAuthService.addFacebook('329678091107847');
  }

}
