import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterData } from '../../../core/services/auth.service';
import { CustomSocialAuthService } from '../../core/services/social-auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  loading = false;
  private socialLoginSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socialAuthService: CustomSocialAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['']
    }, {
      validators: this.passwordMatchValidator
    });

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

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Welcome back!',
          text: 'You have successfully logged in.',
          timer: 1500
        }).then(() => {
          this.closeModal();
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error.message || 'Invalid email or password'
        });
      }
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.registerForm.value;
    const registerData: RegisterData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created successfully.',
          timer: 1500
        }).then(() => {
          this.closeModal();
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.error.message || 'An error occurred during registration'
        });
      }
    });
  }

  forgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address first'
      });
      return;
    }

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Email Sent',
          text: 'Please check your email for password reset instructions'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send Reset Email',
          text: error.error.message || 'An error occurred while processing your request'
        });
      }
    });
  }

  closeModal(): void {
    $('#authModal').modal('hide');
  }

  // Helper methods for template
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }
  
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get phone() { return this.registerForm.get('phone'); }

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