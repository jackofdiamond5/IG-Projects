import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { IgxNavigationDrawerComponent, IgxDropDownComponent } from 'igniteui-angular';

import { routes } from './app-routing.module';
import { UserService } from './authentication/services/user.service';
import { LoginDialogComponent } from './authentication/login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loggedIn: boolean;

  public topNavLinks: Array<{
    path: string,
    name: string
  }> = [];

  @ViewChild(IgxNavigationDrawerComponent) public navdrawer: IgxNavigationDrawerComponent;
  @ViewChild(LoginDialogComponent) loginDialog: LoginDialogComponent;
  @ViewChild(IgxDropDownComponent) igxDropDown: IgxDropDownComponent;

  constructor(private router: Router, private userService: UserService) {
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
  }

  @HostListener('#loginButton click')
  openDialog() {
    this.loginDialog.open();
  }

  @HostListener('#logout click')
  handleLogout() {
    this.router.navigate(['/home']);
    this.userService.logout();
  }

  @HostListener('#profile click')
  openProfile() {
    this.router.navigate(['/profile']);
  }

  @HostListener('#home click')
  navigateHome() {
    this.router.navigate(['/home']);
  }
}
