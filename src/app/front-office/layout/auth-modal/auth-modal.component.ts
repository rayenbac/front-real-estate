import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CustomSocialAuthService } from '../../../core/services/social-auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  private socialLoginSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private socialAuthService: CustomSocialAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.socialLoginSub = this.socialAuthService.user$.subscribe(user => {
      if (user) {
        this.handleSocialLogin(user);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.socialLoginSub) {
      this.socialLoginSub.unsubscribe();
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have been logged in successfully!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message || 'An error occurred during login',
          });
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name, email, password).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been registered successfully!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.isLoginMode = true;
          });
        },
        error: (error: Error) => {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message || 'An error occurred during registration',
          });
        }
      });
    }
  }

  onGoogleLogin(): void {
    this.socialAuthService.signInWithGoogle();
  }

  onFacebookLogin(): void {
    this.socialAuthService.signInWithFacebook();
  }

  private handleSocialLogin(user: any): void {
    this.authService.socialLogin(user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have been logged in successfully!',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      },
      error: (error: Error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'An error occurred during social login',
        });
      }
    });
  }
} 