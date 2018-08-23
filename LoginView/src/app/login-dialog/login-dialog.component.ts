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

  @HostListener('onClose')
  resetForms() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    loginForm.hidden = false;
    registrationForm.hidden = true;
  }

  open() {
    this.loginDialog.open();
  }

  @HostListener('#register click')
  changeTitle() {
    this.title = 'Register';
  }
}
