// src/app/services/market.service.ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MarketListing } from "../models/interfaces";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class MarketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = "http://localhost:3000/market";

  // Get all market listings
  getAllListings(): Observable<MarketListing[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<MarketListing[]>(this.apiUrl, { headers });
  }

  // List a skin for sale
  listSkinForSale(skinInstanceId: number, price: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/list`,
      { skinInstanceId, price },
      { headers },
    );
  }

  // Buy a skin
  buySkin(skinInstanceId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/buy/${skinInstanceId}`,
      {},
      { headers },
    );
  }
}
