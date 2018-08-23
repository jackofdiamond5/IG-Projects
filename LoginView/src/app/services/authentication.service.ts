import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResultModel } from '../models/LoginResultModel';
import { User } from '../models/UserModel';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(firstName: string, lastName: string, username: string, password: string) {
    return this.http.post<any>(`/home`, { firstName: firstName, lastName: lastName, username: username, password: password })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  register(user: User) {
    return this.http.post('/home' + user.id, user);
  }

  // login(email: string, password: string): Observable<LoginResultModel> {
  //   return this.http.post<LoginResultModel>('https://reqres.in/api/login', {
  //     email: email,
  //     password: password
  //   });
  // }

  // register(firstName: string, lastName: string, email: string, password: string): Observable<User> {
  //   return this.http.post<User>('https://reqres.in/api/register', {
  //     firstName: firstName,
  //     lastName: lastName,
  //     email: email,
  //     password: password
  //   });
  // }
}
