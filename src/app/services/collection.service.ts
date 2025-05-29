// src/app/services/collection.service.ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Collection } from "../models/interfaces";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = "http://localhost:3000/collections"; // Adjust to your backend URL

  // Get all collections
  getAllCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.apiUrl);
  }

  // Get collection by ID
  getCollectionById(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/${id}`);
  }

  // Create collection (admin only)
  createCollection(collection: Partial<Collection>): Observable<Collection> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Collection>(this.apiUrl, collection, { headers });
  }

  // Update collection (admin only)
  updateCollection(
    id: number,
    collection: Partial<Collection>,
  ): Observable<Collection> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Collection>(`${this.apiUrl}/${id}`, collection, {
      headers,
    });
  }

  // Delete collection (admin only)
  deleteCollection(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
