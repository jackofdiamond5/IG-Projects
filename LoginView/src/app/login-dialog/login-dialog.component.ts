import { Component, OnInit, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  title: string;

  @ViewChild(IgxDialogComponent) public loginDialog: IgxDialogComponent;

  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

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

  @HostListener('registered')
  handleRegistered() {
    this.showLoginForm();
  }

  @HostListener('loggedIn')
  handleLoggedIn(user) {
    this.loginDialog.close();
    this.loggedIn.emit(user);
  }
}
