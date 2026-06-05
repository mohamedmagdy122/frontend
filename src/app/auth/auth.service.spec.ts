import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    routerSpy = { navigate: jest.fn() };
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should start logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.getUsername()).toBeNull();
  });

  it('should register and store token', () => {
    service.register('testuser', 'test@example.com', 'pass').subscribe();

    const req = httpMock.expectOne('/api/identity/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      password: 'pass'
    });

    req.flush({ token: 'jwt-token', username: 'testuser', userId: 1, expiry: '2026-01-01' });

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getToken()).toBe('jwt-token');
    expect(service.getUsername()).toBe('testuser');
  });

  it('should login and store token', () => {
    service.login('testuser', 'pass').subscribe();

    const req = httpMock.expectOne('/api/identity/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token', username: 'testuser', userId: 1, expiry: '2026-01-01' });

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getToken()).toBe('jwt-token');
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('userId', '1');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getUsername()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
