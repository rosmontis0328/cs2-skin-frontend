// src/app/pages/auth/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-4xl font-bold text-cs-blue mb-2">Join CS2 Skins</h2>
          <p class="text-gray-400">Create your account to start trading</p>
        </div>

        <!-- Register Form -->
        <div class="card">
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-6">
            
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 bg-cs-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cs-blue focus:ring-2 focus:ring-cs-blue/20 transition-all"
                placeholder="Choose a username"
                [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
              />
              <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" 
                   class="text-red-400 text-sm mt-1">
                <span *ngIf="registerForm.get('username')?.errors?.['required']">Username is required</span>
                <span *ngIf="registerForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</span>
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 bg-cs-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cs-blue focus:ring-2 focus:ring-cs-blue/20 transition-all"
                placeholder="Enter your email"
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
                   class="text-red-400 text-sm mt-1">
                Please enter a valid email address
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 bg-cs-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cs-blue focus:ring-2 focus:ring-cs-blue/20 transition-all"
                placeholder="Create a password"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
                   class="text-red-400 text-sm mt-1">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="w-full px-4 py-3 bg-cs-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cs-blue focus:ring-2 focus:ring-cs-blue/20 transition-all"
                placeholder="Confirm your password"
                [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              />
              <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" 
                   class="text-red-400 text-sm mt-1">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</span>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p class="text-red-400 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p class="text-green-400 text-sm">{{ successMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div *ngIf="loading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-400">
              Already have an account? 
              <a routerLink="/login" class="text-cs-blue hover:text-cs-blue/80 font-medium ml-1">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { username, email, password } = this.registerForm.value;

      this.authService.register(email, password, username).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Account created successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    }
  }
}