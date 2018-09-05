import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IUser } from '../interfaces/user-model.interface.';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: IUser[] = JSON.parse(localStorage.getItem('users')) || [];

        return of(null).pipe(mergeMap(() => {
            // login user
            if (request.url.endsWith('/login') && request.method === 'POST') {
                return this.loginHandle(request, users);
            }

            // register user
            if (request.url.endsWith('/register') && request.method === 'POST') {
                return this.registerHandle(request, users);
            }

            // login user with external provider
            if (request.url.endsWith('/extlogin') && request.method === 'POST') {
                return this.loginExt(request, users);
            }

            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(dematerialize());
    }

    loginExt(request: HttpRequest<any>, users: IUser[]) {
        // TODO: Add logic for multiple providers
        // const user = request.body.userInfo as IUser;
        // const provider = request.body.provider;

        this.registerHandle(request, users);
        const userData = this.loginHandle(request, users);

        return of(new HttpResponse({ status: 200, body: userData }));
    }

    registerHandle(request: HttpRequest<any>, users: IUser[]) {
        const newUser = request.body as IUser;
        newUser.token = this.generateToken();
        const duplicateUser = users.filter(user => user.username === newUser.username).length;
        if (duplicateUser) {
            return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
        }

        newUser.id = users.length + 1;
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return of(new HttpResponse({ status: 200, body: newUser }));
    }

    loginHandle(request: HttpRequest<any>, users: IUser[]) {
        debugger;
        const filteredUsers = users.filter(user => {
            return user.id === request.body.id;
        });
        // authenticate
        if (filteredUsers.length) {
            const user: IUser = filteredUsers[0];
            const body: IUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                token: user.token,
                picture: user.picture,
                username: user.username,
            };

            return of(new HttpResponse({ status: 200, body: body }));
        } else {
            return throwError({ error: { message: 'User does not exist!' } });
        }
    }

    private generateToken(): string {
        return Math.random().toString(36).substring(6);
    }
}

export const BackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi: true
};
