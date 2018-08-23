import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  IgxNavigationDrawerModule, IgxNavbarModule,
  IgxLayoutModule, IgxRippleModule,
  IgxInputGroupModule, IgxIconModule,
  IgxDialogModule, IgxDropDownModule,
  IgxButtonModule, IgxToggleModule
} from 'igniteui-angular';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { IgxCategoryChartModule } from 'igniteui-angular-charts/ES5/igx-category-chart-module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogComponent,
    DropDownComponent,
    CategoryChartComponent,
    LoginComponent,
    RegisterComponent,
    LoginDialogComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
