import { IgxDialogComponent } from 'igniteui-angular';
import { Component, OnInit, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../interfaces/user-model.interface.';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  title: string;
  currentUser: IUser;

  @ViewChild(IgxDialogComponent) public loginDialog: IgxDialogComponent;


  constructor(private authentication: AuthenticationService) { }

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

  @HostListener('registered')
  handleRegistered() {
    this.showLoginForm();
  }

  @HostListener('loggedIn')
  handleLoggedIn() {
    this.loginDialog.close();
    this.setUserState();
  }

  setUserState() {
    this.currentUser = this.authentication.loggedInUser;
  }
}
