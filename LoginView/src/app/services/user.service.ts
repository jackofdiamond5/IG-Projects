import { Injectable } from '@angular/core';

import { IUser } from '../interfaces/user-model.interface.';

const TOKEN = 'TOKEN';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _currentUser: IUser;
  public get currentUser(): IUser {
    if (!this._currentUser) {
      this._currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    return this._currentUser;
  }
  public set currentUser(v: IUser) {
    this._currentUser = v;
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  isLogged() {
    return localStorage.getItem(TOKEN) != null;
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = user;
  }

  logout() {
    this._currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
