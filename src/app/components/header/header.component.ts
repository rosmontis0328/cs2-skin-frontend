// src/app/components/header/header.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private balanceService = inject(BalanceService);
  private router = inject(Router);
  
  userBalance: number | null = null;
  isLoggedIn: boolean = false;
  private authSubscription?: Subscription;
  private balanceSubscription?: Subscription;

  ngOnInit(): void {
    // Check initial auth state
    this.checkAuthState();
    
    // Subscribe to auth changes
    this.authSubscription = this.authService.token$.subscribe(() => {
      this.checkAuthState();
    });

    // Subscribe to balance changes
    this.balanceSubscription = this.balanceService.balance$.subscribe(balance => {
      if (this.isLoggedIn && balance > 0) {
        this.userBalance = balance;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
  }

  private checkAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn) {
      this.loadUserBalance();
    } else {
      this.userBalance = null;
    }
  }

  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
      // Update balance service
      this.balanceService.updateBalance(balanceData.balance);
    } catch (error: any) {
      console.error('Error loading user balance:', error);
      // If there's an auth error, user might need to login again
      if (error?.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}