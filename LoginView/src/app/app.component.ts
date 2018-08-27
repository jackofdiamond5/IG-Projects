import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { routes } from './app-routing.module';

import {
  IgxNavigationDrawerComponent, IgxDropDownComponent,
  ConnectedPositioningStrategy, CloseScrollStrategy,
  HorizontalAlignment, VerticalAlignment
} from 'igniteui-angular';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

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


  private _positionSettings = {
    horizontalStartPoint: HorizontalAlignment.Left,
    verticalStartPoint: VerticalAlignment.Bottom
  };

  private _overlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(this._positionSettings),
    scrollStrategy: new CloseScrollStrategy()
  };

  constructor(private router: Router) {
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

  @HostListener('#logoutButton click')
  handleLogout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
    this.igxDropDown.toggle();
    this.loggedIn = false;
  }

  @HostListener('loggedIn')
  handleLogin() {
    this.loggedIn = true;
  }

  @HostListener('#profile click')
  openProfile() {
    this.router.navigate(['/profile']);
  }

  @HostListener('#showOptions click')
  toggleDropDown(event) {
    this._overlaySettings.positionStrategy.settings.target = event.target;
    this.igxDropDown.toggle(this._overlaySettings);
  }
}
