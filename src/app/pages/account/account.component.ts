// src/app/pages/account/account.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
  private router = inject(Router);

  userBalance: number = 0;
  loading = true;

  ngOnInit(): void {
    this.loadAccountData();
  }

  async loadAccountData(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
      this.loading = false;
    } catch (error) {
      console.error('Error loading account data:', error);
      this.loading = false;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}