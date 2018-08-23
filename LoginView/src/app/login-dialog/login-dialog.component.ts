import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  title = 'Login';

  @ViewChild(IgxDialogComponent) public loginDialog: IgxDialogComponent;

  constructor() { }

  ngOnInit() {
  }

  open() {
    this.loginDialog.open();
  }

  @HostListener('onOpen')
  showLoginForm() {
    this.title = 'Login';
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    loginForm.hidden = false;
    registrationForm.hidden = true;
  }

  @HostListener('viewChange')
  changeTitle(title) {
    this.title = title;
  }
}
