import { filter } from 'rxjs/operators';
import { routes } from './app-routing.module';
import { NavigationStart, Router } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { IgxNavigationDrawerComponent, IgxDropDownComponent } from 'igniteui-angular';
import { AuthenticationService } from './services/authentication.service';
import { IUser } from './interfaces/user-model.interface.';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loggedIn: boolean;
  currentUser: IUser;

  public topNavLinks: Array<{
    path: string,
    name: string
  }> = [];

  @ViewChild(IgxNavigationDrawerComponent) public navdrawer: IgxNavigationDrawerComponent;
  @ViewChild(LoginDialogComponent) loginDialog: LoginDialogComponent;
  @ViewChild(IgxDropDownComponent) igxDropDown: IgxDropDownComponent;

  constructor(private router: Router, private authentication: AuthenticationService) {
    for (const route of routes) {
      if (route.path && route.data && route.path.indexOf('*') === -1) {
        this.topNavLinks.push({
          name: route.data.text,
          path: '/' + route.path
        });
      }
    }
  }

  public ngOnInit(): void {
    this.router.events.pipe(
      filter((x) => x instanceof NavigationStart)
    )
      .subscribe((event: NavigationStart) => {
        if (event.url !== '/' && !this.navdrawer.pin) {
          // Close drawer when selecting a view on mobile (unpinned)
          this.navdrawer.close();
        }
      });

    this.setUserState();
  }

  @HostListener('#loginButton click')
  openDialog() {
    this.loginDialog.open();
  }

  @HostListener('#logout click')
  handleLogout() {
    this.router.navigate(['/home']);
    this.authentication.logout();
    this.setUserState();
  }

  @HostListener('loggedIn')
  handleLogin() {
    this.loggedIn = true;
    this.setUserState();
  }

  @HostListener('#profile click')
  openProfile() {
    this.router.navigate(['/profile']);
  }

  @HostListener('#home click')
  navigateHome() {
    this.router.navigate(['/home']);
  }

  private setUserState() {
    // tslint:disable-next-line:no-debugger
    debugger;
    this.currentUser = this.authentication.loggedInUser;
  }
}
