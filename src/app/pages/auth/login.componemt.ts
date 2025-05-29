// src/app/pages/auth/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-4xl font-bold text-cs-blue mb-2">Welcome Back</h2>
          <p class="text-gray-400">Sign in to your CS2 Skins account</p>
        </div>

        <!-- Login Form -->
        <div class="card">
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
            
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
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
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
                placeholder="Enter your password"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="text-red-400 text-sm mt-1">
                Password is required
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p class="text-red-400 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div *ngIf="loading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-400">
              Don't have an account? 
              <a routerLink="/register" class="text-cs-blue hover:text-cs-blue/80 font-medium ml-1">
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/collections']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error('Login error:', error);
        }
      });
    }
  }
}