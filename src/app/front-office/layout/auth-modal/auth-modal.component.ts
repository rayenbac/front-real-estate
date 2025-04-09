import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterData } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  @ViewChild('modal', { static: false }) modal!: ElementRef;

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  loading = false;
  isVisible = false;
  private triggerElement: HTMLElement | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: [''],
    });
  }

  show(triggerElement?: HTMLElement): void {
    this.triggerElement = triggerElement || null;
    this.isVisible = true;
    setTimeout(() => {
      if (this.modal?.nativeElement) {
        this.modal.nativeElement.focus();
      }
    }, 0);
  }

  closeModal(): void {
    this.isVisible = false;
    this.loginForm.reset();
    this.registerForm.reset();
    this.isLoginMode = true;
    this.loading = false;
    if (this.triggerElement) {
      this.triggerElement.focus(); // Return focus to the trigger
      this.triggerElement = null;
    }
    this.close.emit();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Logged In',
          text: 'You have successfully logged in!',
          timer: 1500,
        });
        this.closeModal();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'Invalid email or password',
        });
      },
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { firstName, lastName, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Passwords do not match!',
      });
      return;
    }

    this.loading = true;
    const name = `${firstName} ${lastName}`;

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Registered',
          text: 'You have successfully registered! Please log in.',
          timer: 1500,
        });
        this.isLoginMode = true;
        this.registerForm.reset();
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message || 'Something went wrong',
        });
      },
    });
  }
}