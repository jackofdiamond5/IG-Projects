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
           // debugger;
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

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    return throwError({ error: { message: 'Unauthorised' }});
                }
            }

            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    const matchedUsers = users.filter(u => u.id === id);
                    const user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    return throwError({ error: { message: 'Unauthorised' } });
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

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    for (let i = 0; i < users.length; i++) {
                        const user = users[i];
                        if (user.id === id) {
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    return of(new HttpResponse({ status: 200 }));
                } else {
                    return throwError({ error: { message: 'Unauthorised' } });
                }
            }

            return next.handle(request);
        }))

            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}

export let backendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi: true
};
