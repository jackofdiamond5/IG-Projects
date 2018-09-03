import { IUser } from '../interfaces/user-model.interface.';
import { IRegister } from '../interfaces/register.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Injector } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

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

  constructor(private authentication: AuthenticationService, private router: Router, private injector: Injector, fb: FormBuilder) {
    this.registrationForm = fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.nullValidator],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  tryRegister() {
    this.authentication
      .register(this.registrationForm.value)
      .subscribe(
        r => {
          this.authentication.login(r as IUser);
          this.router = this.injector.get(Router);
          this.router.navigate(['/profile']);
        },
        e => {
          alert(e.error.message);
        }
      );
  }
}
