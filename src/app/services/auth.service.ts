// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../models/interfaces';
import { BalanceService } from './balance.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private balanceService = inject(BalanceService);
  private apiUrl = 'http://localhost:3000/auth'; // Adjust to your backend URL
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  // Login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
        })
      );
  }

  // Register
  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  }

  // Logout
  logout(): void {
    localStorage.removeItem('cs2_token');
    this.tokenSubject.next(null);
    // Reset balance when logging out
    this.balanceService.resetBalance();
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('cs2_token');
  }

  // Set token in localStorage
  private setToken(token: string): void {
    localStorage.setItem('cs2_token', token);
    this.tokenSubject.next(token);
  }
}