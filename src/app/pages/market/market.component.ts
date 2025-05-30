// src/app/pages/market/market.component.ts - COMPLETE FIXED VERSION
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MarketService } from '../../services/market.service';
import { SkinService } from '../../services/skin.service';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';
import { MarketListing, SkinInstance, Collection, Rarity, Wear } from '../../models/interfaces';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit {
  private marketService = inject(MarketService);
  private skinService = inject(SkinService);
  private collectionService = inject(CollectionService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private balanceService = inject(BalanceService);
  private fb = inject(FormBuilder);

  // Data
  marketListings: any[] = [];
  userSkinInstances: SkinInstance[] = [];
  filteredListings: any[] = [];
  collections: Collection[] = [];
  
  // State
  loading = true;
  userSkinsLoading = false;
  showSellModal = false;
  selectedSkinToSell: SkinInstance | null = null;
  userBalance = 0;

  // Forms
  filterForm: FormGroup;
  sellForm: FormGroup;

  // Filter/Sort options
  rarityOptions = Object.values(Rarity);
  wearOptions = Object.values(Wear);
  sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  constructor() {
    this.filterForm = this.fb.group({
      search: [''],
      collection: [''],
      rarity: [''],
      wear: [''],
      minPrice: [''],
      maxPrice: [''],
      isStattrak: [false],
      isSouvenir: [false],
      minFloat: [''],
      maxFloat: [''],
      sortBy: ['price_asc']
    });

    this.sellForm = this.fb.group({
      price: ['']
    });
  }

  ngOnInit(): void {
    this.loadMarketData();
    this.loadUserBalance();
    this.setupFilterSubscription();
  }

  // SECURITY FIX: Get current user ID from JWT token
  private getCurrentUserId(): number | null {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  async loadMarketData(): Promise<void> {
    try {
      this.loading = true;
      const [listings, collections] = await Promise.all([
        this.marketService.getAllListings().toPromise(),
        this.collectionService.getAllCollections().toPromise()
      ]);
      
      this.marketListings = listings || [];
      this.collections = collections || [];
      this.applyFilters();
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      this.loading = false;
    }
  }

  // SECURITY FIX: Only load current user's skins
  async loadUserSkins(): Promise<void> {
    try {
      this.userSkinsLoading = true;
      const currentUserId = this.getCurrentUserId();
      
      if (!currentUserId) {
        console.error('No user ID found');
        this.userSkinInstances = [];
        return;
      }

      const allSkinInstances = await this.skinService.getAllSkinInstances().toPromise();
      
      // CRITICAL: Filter skins by current user ID AND availability
      this.userSkinInstances = (allSkinInstances || []).filter(
        (instance: SkinInstance) => 
          instance.owner?.id === currentUserId && // Only current user's skins
          !instance.is_listed_for_sale && 
          !instance.is_traded_away
      );
      
      console.log(`Loaded ${this.userSkinInstances.length} skins for user ${currentUserId}`);
      
    } catch (error) {
      console.error('Error loading user skins:', error);
      this.userSkinInstances = [];
    } finally {
      this.userSkinsLoading = false;
    }
  }

  // BALANCE FIX: Proper balance synchronization
  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
      
      // Update the balance service to keep everything in sync
      this.balanceService.updateBalance(balanceData.balance);
      
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }

  setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.marketListings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item => 
        item.skin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.skin.weapon_type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Collection filter
    if (filters.collection) {
      filtered = filtered.filter(item => item.skin.collection?.id == filters.collection);
    }

    // Rarity filter
    if (filters.rarity) {
      filtered = filtered.filter(item => item.skin.rarity === filters.rarity);
    }

    // Wear filter
    if (filters.wear) {
      filtered = filtered.filter(item => item.wear === filters.wear);
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    }

    // Float filters
    if (filters.minFloat) {
      filtered = filtered.filter(item => item.float_value >= parseFloat(filters.minFloat));
    }
    if (filters.maxFloat) {
      filtered = filtered.filter(item => item.float_value <= parseFloat(filters.maxFloat));
    }

    // StatTrak filter
    if (filters.isStattrak) {
      filtered = filtered.filter(item => item.is_stattrak);
    }

    // Souvenir filter
    if (filters.isSouvenir) {
      filtered = filtered.filter(item => item.is_souvenir);
    }

    // Sorting
    this.applySorting(filtered, filters.sortBy);
  }

  applySorting(items: any[], sortBy: string): void {
    switch (sortBy) {
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        items.sort((a, b) => a.skin.name.localeCompare(b.skin.name));
        break;
      case 'name_desc':
        items.sort((a, b) => b.skin.name.localeCompare(a.skin.name));
        break;
    }
    this.filteredListings = items;
  }

  getRarityColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'white': 'text-gray-300',
      'blue': 'text-blue-400',
      'dark_blue': 'text-blue-600',
      'purple': 'text-purple-400',
      'pink': 'text-pink-400',
      'red': 'text-red-400',
      'contraband': 'text-yellow-400'
    };
    return colors[rarity] || 'text-white';
  }

  getRarityBorderColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'white': 'border-gray-300/50',
      'blue': 'border-blue-400/50',
      'dark_blue': 'border-blue-600/50',
      'purple': 'border-purple-400/50',
      'pink': 'border-pink-400/50',
      'red': 'border-red-400/50',
      'contraband': 'border-yellow-400/50'
    };
    return colors[rarity] || 'border-white/20';
  }

  // BALANCE FIX: Better balance synchronization after purchase
  async buySkin(listing: any): Promise<void> {
    if (this.userBalance < listing.price) {
      alert('Insufficient balance!');
      return;
    }

    if (confirm(`Buy ${listing.skin.name} for $${listing.price}?`)) {
      try {
        const result = await this.marketService.buySkin(listing.id).toPromise();
        alert('Purchase successful!');
        
        // Get the updated balance from the server response if available
        if (result?.newBalance !== undefined) {
          this.userBalance = result.newBalance;
          this.balanceService.updateBalance(result.newBalance);
        } else {
          // Fallback: Reload balance from server
          await this.loadUserBalance();
        }
        
        // Reload market data
        this.loadMarketData();
        
      } catch (error) {
        console.error('Error buying skin:', error);
        alert('Purchase failed. Please try again.');
        // Reload balance in case of error to ensure accuracy
        this.loadUserBalance();
      }
    }
  }

  openSellModal(): void {
    this.showSellModal = true;
    this.loadUserSkins();
  }

  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedSkinToSell = null;
    this.sellForm.reset();
  }

  selectSkinToSell(skin: SkinInstance): void {
    this.selectedSkinToSell = skin;
    this.sellForm.patchValue({ price: skin.skin.base_price });
  }

  async listSkinForSale(): Promise<void> {
    if (!this.selectedSkinToSell || this.sellForm.invalid) return;

    const price = this.sellForm.value.price;
    
    try {
      await this.marketService.listSkinForSale(this.selectedSkinToSell.id, price).toPromise();
      alert('Skin listed for sale successfully!');
      this.closeSellModal();
      this.loadMarketData();
    } catch (error) {
      console.error('Error listing skin:', error);
      alert('Failed to list skin. Please try again.');
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      collection: '',
      rarity: '',
      wear: '',
      minPrice: '',
      maxPrice: '',
      isStattrak: false,
      isSouvenir: false,
      minFloat: '',
      maxFloat: '',
      sortBy: 'price_asc'
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}