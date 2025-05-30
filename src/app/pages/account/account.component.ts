// src/app/pages/account/account.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { BalanceService } from '../../services/balance.service';

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private balanceService = inject(BalanceService);
  private router = inject(Router);

  currentUser: CurrentUser | null = null;
  userBalance: number = 0;
  loading = true;

  ngOnInit(): void {
    this.loadAccountData();
  }

  async loadAccountData(): Promise<void> {
    try {
      const [balanceData, userInfo] = await Promise.all([
        this.userService.getBalance(),
        this.getCurrentUserInfo()
      ]);
      
      this.userBalance = balanceData.balance;
      this.currentUser = userInfo;
      this.balanceService.updateBalance(balanceData.balance);
      this.loading = false;
    } catch (error) {
      console.error('Error loading account data:', error);
      this.loading = false;
    }
  }

  private async getCurrentUserInfo(): Promise<CurrentUser> {
    try {
      // Try to get user info from balance response first
      const balanceData = await this.userService.getBalance();
      
      // // If your backend returns user info with balance, use it
      // if (balanceData.userId) {
      //   try {
      //     const userDetails = await this.userService.getUserById(balanceData.userId).toPromise();
      //     return {
      //       id: userDetails.id,
      //       username: userDetails.username,
      //       email: userDetails.email,
      //       created_at: userDetails.created_at
      //     };
      //   } catch (error) {
      //     console.log('Could not get user details, using token data');
      //   }
      // }

      // Fallback: Extract info from JWT token
      return this.getUserInfoFromToken();
      
    } catch (error) {
      console.error('Error getting user info:', error);
      return this.getUserInfoFromToken();
    }
  }

  private getUserInfoFromToken(): CurrentUser {
    const token = this.authService.getToken();
    if (token) {
      try {
        // Decode JWT token (basic decode, don't use in production without proper validation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        return {
          id: payload.sub || 0,
          username: payload.username || 'User',
          email: payload.email || 'user@example.com',
          created_at: new Date()
        };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Ultimate fallback
    return {
      id: 0,
      username: 'User',
      email: 'user@example.com',
      created_at: new Date()
    };
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    if (this.currentUser?.username) {
      return this.currentUser.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }
}