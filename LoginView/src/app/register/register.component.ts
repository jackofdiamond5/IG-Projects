import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  @Output() registered: EventEmitter<any> = new EventEmitter();

  constructor(private authentication: AuthenticationService, private user: UserService, fb: FormBuilder) {
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
    this.authentication
      .register(this.myRegistration.value)
      .subscribe(
        r => {
          this.registered.emit();
        }
      );
  }
}
