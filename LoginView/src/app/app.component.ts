import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { routes } from './app-routing.module';

import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { IgxDialogComponent } from 'igniteui-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Login';

  public topNavLinks: Array<{
    path: string,
    name: string
  }> = [];

  @ViewChild(IgxNavigationDrawerComponent) public navdrawer: IgxNavigationDrawerComponent;
  @ViewChild(IgxDialogComponent) public loginDialog: IgxDialogComponent;

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

  @HostListener('onClose')
  resetForms() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    loginForm.hidden = false;
    registrationForm.hidden = true;
  }
}
