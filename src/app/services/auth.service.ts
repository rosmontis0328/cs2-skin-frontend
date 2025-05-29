import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoginResponse, User } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/auth";

  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  // ✅ Track current user state
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.access_token);
          this.loadUser();
        }),
      );
  }

  // Register
  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      password,
      username,
    });
  }

  // Logout
  logout(): void {
    localStorage.removeItem("cs2_token");
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  // ✅ Load current user if token exists
  loadUser(): void {
    const token = this.getToken();
    if (!token) return;

    this.http.get<User>(`${this.apiUrl}/me`).subscribe({
      next: (user) => this.userSubject.next(user),
      error: () => this.logout(),
    });
  }

  // Get logged-in user object (sync)
  getUser(): User | null {
    return this.userSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem("cs2_token");
  }

  // Set token in localStorage
  private setToken(token: string): void {
    localStorage.setItem("cs2_token", token);
    this.tokenSubject.next(token);
  }

  // Auth header for manual requests (optional use)
  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
