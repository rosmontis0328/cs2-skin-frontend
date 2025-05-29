// src/app/services/market.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketListing } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/market';

  // Get all market listings
  getAllListings(): Observable<MarketListing[]> {
    return this.http.get<MarketListing[]>(this.apiUrl);
  }

  // List a skin for sale
  listSkinForSale(skinInstanceId: number, price: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/list`, { skinInstanceId, price });
  }

  // Buy a skin
  buySkin(skinInstanceId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy/${skinInstanceId}`, {});
  }
}