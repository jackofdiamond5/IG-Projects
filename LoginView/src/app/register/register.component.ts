import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IRegister } from '../interfaces/register.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, IRegister {
  firstName: string;
  lastName: string;
  username: string;
  password: string;

  public myUser: FormGroup;
  public myRegistration: FormGroup;

  constructor(private authentication: AuthenticationService, private user: UserService, fb: FormBuilder) {
    this.myUser = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.myRegistration = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  tryRegister() {
    this.authentication.register(
      this.firstName,
      this.lastName,
      this.username,
      this.password
    )
      .subscribe(
        r => {
          const msgSuccess = document.getElementById('registrationSuccessMsg');
          const registrationForm = document.getElementById('registrationForm');

          registrationForm.hidden = true;
          msgSuccess.hidden = false;
        },
        r => {
          alert(r.error.error);
        });
  }
}
