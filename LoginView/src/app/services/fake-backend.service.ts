import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user-model.interface.';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';

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

            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(dematerialize());
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
        const filteredUsers = users.filter(user => {
            return user.username === request.body.username && user.password === user.password;
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
                password: user.password,
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

    private hash(word: string) {
        let hash = 0;
        if (word.length === 0) {
            return hash;
        }
        for (let i = 0; i < word.length; i++) {
            // tslint:disable-next-line:no-bitwise
            const char = word.charCodeAt(i); hash = ((hash << 5) - hash) + char; hash = hash & hash;
        }
        return hash;
    }

    private salt(): string {
        return crypto.getRandomValues(new Uint32Array(1)).toString();
    }
}

export const BackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi: true
};
