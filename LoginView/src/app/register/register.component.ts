import { IUser } from '../interfaces/user-model.interface.';
import { IRegister } from '../interfaces/register.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Injector, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, IRegister {
  name: string;
  username: string;
  email: string;
  password: string;

  public registrationForm: FormGroup;

  @Output() registered: EventEmitter<any> = new EventEmitter();

  constructor(private authentication: AuthenticationService,
    private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.nullValidator],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  tryRegister() {
    const response = this.authentication.register(this.registrationForm.value);
    console.log(response);
    if (response) {
      this.userService.setCurrentUser(response);
      this.router.navigate(['/profile']);
      this.registered.emit();
    }
  }
}
