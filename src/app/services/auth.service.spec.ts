import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth/login`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should perform a complete login', () => {
    const loginRequest = { username: 'user@exemple.com', password: 'MotDePasse123!' };
    const jwtResponse = {
      token: 'jeton-fake-jwt',
      username: 'user@exemple.com',
      roles: ['USER']
    };

    service.login(loginRequest).subscribe(res => {
      // Vérifie la réception de la réponse et ses données
      expect(res.token).toBe('jeton-fake-jwt');
      expect(res.username).toBe('user@exemple.com');
      expect(res.roles).toContain('USER');
    });

    // On vérifie que la requête HTTP a bien été déclenchée vers l’URL API
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);

    // Répond avec la fausse réponse JWT simulée
    req.flush(jwtResponse);
  });

  it('should handle login error', () => {
    const LoginRequest = { username: 'user@exemple.com', password: 'wrong-password' };
    const errorMessage = 'Invalid credentials';

    service.login(LoginRequest).subscribe({
      next: () => fail('expected an error, not data'),
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
  });

});