import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('registers through the same-origin API and attaches the returned token to later requests', () => {
    const user = {
      id: 1,
      name: 'Student',
      email: 'student@example.test',
      filiere: 'informatique',
      email_verified_at: '2026-11-10T12:00:00.000000Z',
    };

    service.register({
      email: user.email,
      password: 'StrongPassword123',
      password_confirmation: 'StrongPassword123',
      filiere: user.filiere,
    }).subscribe();

    http.expectOne('/api/register').flush({ token: 'test-token', user });
    expect(localStorage.getItem('sama_ufr_token')).toBe('test-token');
    expect(service.user()).toEqual(user);

    service.verifyEmail({ email: user.email, code: '123456' }).subscribe();
    const verificationRequest = http.expectOne('/api/email/verify');
    expect(verificationRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
    verificationRequest.flush({ verified: true });

    service.logout().subscribe();
    const logoutRequest = http.expectOne('/api/logout');
    expect(logoutRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
    logoutRequest.flush({ message: 'Déconnexion réussie.' });
    expect(localStorage.getItem('sama_ufr_token')).toBeNull();
    expect(service.user()).toBeNull();
  });
});
