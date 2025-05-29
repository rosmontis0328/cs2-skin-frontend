// src/app/components/header/header.component.ts
import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  userBalance: number | null = null;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Check if user is logged in
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.loadUserBalance();
    }
  }

  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
    } catch (error) {
      console.error("Error loading user balance:", error);
    }
  }
}
