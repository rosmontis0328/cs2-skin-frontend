// src/app/services/skin.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skin, SkinInstance } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SkinService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/skin';
  private instanceApiUrl = 'http://localhost:3000/skin-instances';

  // Get all skins
  getAllSkins(): Observable<Skin[]> {
    return this.http.get<Skin[]>(`${this.apiUrl}/findAll`);
  }

  // Get skin by ID
  getSkinById(id: number): Observable<Skin> {
    return this.http.get<Skin>(`${this.apiUrl}/findById/${id}`);
  }

  // Search skins by name
  searchSkinsByName(name: string): Observable<Skin[]> {
    return this.http.get<Skin[]>(`${this.apiUrl}/searchSkinsByName/${name}`);
  }

  // Get all skin instances
  getAllSkinInstances(): Observable<SkinInstance[]> {
    return this.http.get<SkinInstance[]>(this.instanceApiUrl);
  }

  // Get skin instance by ID
  getSkinInstanceById(id: number): Observable<SkinInstance> {
    return this.http.get<SkinInstance>(`${this.instanceApiUrl}/${id}`);
  }

  // Create skin (admin only)
  createSkin(skin: Partial<Skin>): Observable<Skin> {
    return this.http.post<Skin>(this.apiUrl, skin);
  }

  // Create multiple skins (admin only)
  createBulkSkins(skins: Partial<Skin>[]): Observable<Skin[]> {
    return this.http.post<Skin[]>(`${this.apiUrl}/bulk`, skins);
  }

  // Update skin (admin only)
  updateSkin(id: number, skin: Partial<Skin>): Observable<Skin> {
    return this.http.patch<Skin>(`${this.apiUrl}/update/${id}`, skin);
  }

  // Delete skin (admin only)
  deleteSkin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}