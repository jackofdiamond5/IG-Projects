import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ILogin } from '../interfaces/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, ILogin {
  username: string;
  password: string;

  public myUser: FormGroup;
  public myRegistration: FormGroup;

  @Output() viewChange: EventEmitter<any> = new EventEmitter();

  constructor(private authentication: AuthenticationService, private user: UserService, fb: FormBuilder) {
    this.myUser = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.myRegistration = fb.group({
      newEmail: ['', Validators.required],
      newPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  tryLogIn() {
    
  }

  // tryLogIn() {
  //   this.authentication.login(
  //     this.username,
  //     this.password
  //   )
  //     .subscribe(
  //       r => {
  //         if (r.token) {
  //           const msgSuccess = document.getElementById('successMsg');
  //           const msgHello = document.getElementById('helloMsg');
  //           const form = document.getElementById('loginForm');

  //           this.user.setToken(r.token);
  //           msgHello.textContent = 'Hello, ' + this.username + '! You have successfully logged in! ';
  //           form.hidden = true;
  //           msgSuccess.hidden = false;
  //         }
  //       },
  //       r => {
  //         alert(r.error.error);
  //       });
  // }

  showRegistrationForm() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    loginForm.hidden = true;
    registrationForm.hidden = false;
    this.viewChange.emit('Register');
  }
}
