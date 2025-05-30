// src/app/services/balance.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balanceSubject = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSubject.asObservable();

  updateBalance(newBalance: number): void {
    console.log('BalanceService: Updating balance to', newBalance);
    this.balanceSubject.next(newBalance);
  }

  getCurrentBalance(): number {
    return this.balanceSubject.value;
  }

  // Method to reset balance (for logout)
  resetBalance(): void {
    this.balanceSubject.next(0);
  }
}