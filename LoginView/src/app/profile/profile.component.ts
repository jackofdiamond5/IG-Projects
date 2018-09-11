import { Component, OnInit, Injector } from '@angular/core';
import { IUser } from '../interfaces/user-model.interface';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private userService: UserService) { }

  ngOnInit() { }
}
