import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private MOCK_TOKEN = 'local-dev-token-999';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.seedReviewerUser();
  }

  private seedReviewerUser(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Use the exact username you intend to use for testing/review
    const exists = users.find((u: any) => u.userName === 'tarek');
    if (!exists) {
      users.push({
        id: 999,
        firstName: 'Tarek',
        lastName: 'Rishmawi',
        userName: 'tarek',
        password: 'tarek2026',
      });
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // Clear token before attempting login to prevent stale token issues
    localStorage.removeItem('token');

    return this.http.post<any>(`${this.apiUrl}/authenticate`, { username, password }).pipe(
      map((response) => {
        if (response && response.token) {
          // REAL BACKEND SUCCESS
          localStorage.setItem('token', response.token);
          return true;
        }
        return false;
      }),
      catchError(() => {
        console.warn('Backend offline: Switching to localStorage mock auth.');
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

        const found = users.find(
          (u) => (u.userName === username || u.username === username) && u.password === password,
        );

        if (found) {
          // MOCK SUCCESS
          localStorage.setItem('token', this.MOCK_TOKEN);
          return of(true);
        }
        return of(false);
      }),
    );
  }

  register(user: User): Observable<User | any> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(() => {
        console.warn('Backend offline: Saving user to localStorage.');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = { ...user, id: Math.floor(Math.random() * 1000) };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return of(newUser);
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
    return !!this.getToken();
  }
}
