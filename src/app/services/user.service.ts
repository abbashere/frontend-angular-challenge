import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class UserService {
    public apiUrl: string = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private router: Router,
        public authenticationService: AuthenticationService
    ) {
    }

    getAll() {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${this.apiUrl}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/users/${id}`);
    }

    edit(id, editUser: User) {
      return this.http.put(`${this.apiUrl}/users/${id}`, editUser)
      .pipe(map(x => {
        // update current login record
        if (id == this.authenticationService.currentUserValue.id) {
            const user = { ...this.authenticationService.currentUserValue, ...editUser };
            localStorage.setItem('currentUser', JSON.stringify(user));

            // publish current user to subscribers
            this.authenticationService.currentUserSubject.next(user);
        }
        return x;
    }));
    }
}
