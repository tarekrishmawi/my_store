import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: Pick<User, 'username' | 'password'>) {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: User) {
    return this.http.post<User>(`${this.apiUrl}`, user);
  }

  getUserId(): number | null {
    const token = this.getToken();

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // reutrn the user id from the payload of the token
      return payload.user.id;
    } catch {
      return null;
    }
  }
}
