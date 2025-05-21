import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: spy }]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login form with username and password controls', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should make username and password controls required', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    usernameControl?.setValue('');
    passwordControl?.setValue('');

    expect(usernameControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();
  });

  it('should call AuthService.login when form is valid and submitted', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token', username: 'test@example.com', roles: ['USER'] }));

    component.loginForm.setValue({ username: 'test@example.com', password: 'Password123!' });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledOnceWith({ username: 'test@example.com', password: 'Password123!' });
  });

  it('should not call AuthService.login when form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});

