import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { ErrorRoutingModule } from './error-routing/error-routing.module';
// import { LoginViewComponent } from './login-view/login-view.component';
import { DialogComponent } from './dialog/dialog.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { CategoryChartComponent } from './category-chart/category-chart.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RedirectComponent } from './redirect/redirect.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { text: 'Home' } },
  { path: 'error', component: UncaughtErrorComponent },
  // { path: 'login-view', component: LoginViewComponent, data: { text: 'Login view' } },
  { path: 'dialog', component: DialogComponent, data: { text: 'Dialog' } },
  { path: 'drop-down', component: DropDownComponent, data: { text: 'Drop Down' } },
  { path: 'category-chart', component: CategoryChartComponent, data: { text: 'Category Chart' } },
  { path: 'profile', component: ProfileComponent, data: { text: 'Profile' } },
  { path: 'forbidden', component: ForbiddenComponent, data: { text: 'Forbidden' } },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { text: 'Unauthorized' } },
  { path: 'redirect.html', component: RedirectComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent } // must always be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ErrorRoutingModule],
  exports: [RouterModule, ErrorRoutingModule]
})
export class AppRoutingModule {
}
