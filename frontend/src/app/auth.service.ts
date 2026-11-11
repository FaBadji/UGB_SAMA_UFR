import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

interface AuthResponse {
  token?: string;
  access_token?: string;
  user?: User;
  message?: string;
  requires_email_verification?: boolean;
  verification_email_sent?: boolean;
  email_verified?: boolean;
  [key: string]: unknown;
}

interface User {
  id: number;
  name: string;
  email: string;
  filiere?: string | null;
  email_verified_at?: string | null;
}

const API_URL = '/api';
const TOKEN_KEY = 'sama_ufr_token';
const USER_KEY = 'sama_ufr_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<User | null>(this.readUser());

  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(payload: { email: string; password: string; password_confirmation: string; filiere?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/register`, payload).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, payload).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  logout(): Observable<AuthResponse> {
    if (!this.getToken()) {
      this.clearSession();
      return of({});
    }

    return this.http.post<AuthResponse>(`${API_URL}/logout`, {}).pipe(
      tap(() => this.clearSession()),
    );
  }

  verifyEmail(payload: { email?: string; code: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/email/verify`, payload);
  }

  resendVerification(email?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/email/verification-notification`, email ? { email } : {});
  }

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/forgot-password`, { email });
  }

  resetPassword(payload: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/reset-password`, payload);
  }

  private clearSession(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage failures.
    }
    this.user.set(null);
  }

  private saveSession(response: AuthResponse): void {
    const token = (response.token ?? response.access_token) as string | undefined;
    const user = response.user as User | undefined;

    // Registration does not issue a token until the e-mail is verified.
    if (!token) {
      return;
    }

    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Ignore storage failures.
    }

    if (user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {
        // Ignore storage failures.
      }
      this.user.set(user);
    }
  }

  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
