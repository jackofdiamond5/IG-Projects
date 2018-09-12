import {
  IgxLayoutModule, IgxRippleModule,
  IgxNavigationDrawerModule, IgxNavbarModule,
  IgxButtonModule, IgxToggleModule, IgxAvatarModule, IgxIconModule, IgxDropDownModule
} from 'igniteui-angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxButtonModule,
    IgxToggleModule,
    IgxAvatarModule,
    IgxIconModule,
    IgxDropDownModule,
    AuthenticationModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
