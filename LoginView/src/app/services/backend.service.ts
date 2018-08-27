import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        return of(null).pipe(mergeMap(() => {
            if (request.url.endsWith('/login') && request.method === 'POST') {
                const filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                // authenticate
                if (filteredUsers.length) {
                    const user = filteredUsers[0];
                    const body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // register user
            if (request.url.endsWith('/register') && request.method === 'POST') {
                const newUser = request.body;
                const duplicateUser = users.filter(user => user.username === newUser.username).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                }

                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                return of(new HttpResponse({ status: 200 }));
            }

            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(dematerialize());
    }
}

export const BackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi: true
};
