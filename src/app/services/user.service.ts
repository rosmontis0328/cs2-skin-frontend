// src/app/services/user.service.ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import { User, BalanceResponse } from "../models/interfaces";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = "http://localhost:3000/users";

  // Get user balance
  async getBalance(): Promise<BalanceResponse> {
    const headers = this.authService.getAuthHeaders();
    return firstValueFrom(
      this.http.get<BalanceResponse>(`${this.apiUrl}/balance`, { headers }),
    );
  }

  // Top up balance
  topUpBalance(amount: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/topup`, { amount }, { headers });
  }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  // Update user
  updateUser(id: number, user: Partial<User>): Observable<User> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers });
  }

  // Delete user (admin only)
  deleteUser(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
