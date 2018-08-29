import { Component, OnInit, Injector } from '@angular/core';
import { IUser } from '../interfaces/user-model.interface.';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: IUser;

  constructor(private authentication: AuthenticationService) {
  }

  ngOnInit() {
    this.currentUser = this.authentication.loggedInUser[0];
  }

}
