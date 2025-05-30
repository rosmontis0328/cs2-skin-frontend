import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MarketService } from '../../services/market.service';
import { SkinService } from '../../services/skin.service';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';
import { MarketListing, SkinInstance, Collection, Rarity, Wear, Skin } from '../../models/interfaces';

interface SkinWithImageState extends Skin {
  imageLoaded?: boolean;
  imageFallbackAttempted?: boolean;
}

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

  marketListings: MarketListing[] = [];
  userSkinInstances: SkinInstance[] = [];
  filteredListings: MarketListing[] = [];
  collections: Collection[] = [];

  loading = true;
  userSkinsLoading = false;
  showSellModal = false;
  selectedSkinToSell: SkinInstance | null = null;
  userBalance = 0;

  filterForm: FormGroup;
  sellForm: FormGroup;

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

      this.marketListings.forEach(listing => {
        if (listing.skin) {
          const skinWithState = listing.skin as SkinWithImageState;
          skinWithState.imageLoaded = undefined;
          skinWithState.imageFallbackAttempted = false;
        }
      });

      this.applyFilters();
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      this.loading = false;
    }
  }

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

      this.userSkinInstances = (allSkinInstances || []).filter(
        (instance: SkinInstance) =>
          instance.owner?.id === currentUserId &&
          !instance.is_listed_for_sale &&
          !instance.is_traded_away
      );

      this.userSkinInstances.forEach(instance => {
        if (instance.skin) {
          const skinWithState = instance.skin as SkinWithImageState;
          skinWithState.imageLoaded = undefined;
          skinWithState.imageFallbackAttempted = false;
        }
      });

    } catch (error) {
      console.error('Error loading user skins:', error);
      this.userSkinInstances = [];
    } finally {
      this.userSkinsLoading = false;
    }
  }

  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
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

    if (filters.search) {
      filtered = filtered.filter(item =>
        item.skin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.skin.weapon_type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.collection) {
      filtered = filtered.filter(item => item.skin.collection?.id == filters.collection);
    }

    if (filters.rarity) {
      filtered = filtered.filter(item => item.skin.rarity === filters.rarity);
    }

    if (filters.wear) {
      filtered = filtered.filter(item => item.wear === filters.wear);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    }

    if (filters.minFloat) {
      filtered = filtered.filter(item => item.float_value >= parseFloat(filters.minFloat));
    }

    if (filters.maxFloat) {
      filtered = filtered.filter(item => item.float_value <= parseFloat(filters.maxFloat));
    }

    if (filters.isStattrak) {
      filtered = filtered.filter(item => item.is_stattrak);
    }

    if (filters.isSouvenir) {
      filtered = filtered.filter(item => item.is_souvenir);
    }

    this.applySorting(filtered, filters.sortBy);
  }

  applySorting(items: MarketListing[], sortBy: string): void {
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

  public getSkinImageUrl(skin: Skin): string {
    if (skin.image_path && skin.image_path !== null && skin.image_path !== '') {
      let imagePath = skin.image_path;
      if (imagePath.startsWith('./')) {
        imagePath = imagePath.substring(2);
      }
      if (!imagePath.endsWith('.jpg') && !imagePath.endsWith('.png')) {
        imagePath += '.jpg';
      }
      return `/assets/skins/${imagePath}`;
    }
    return '/assets/skins/AWP_Dragon_Lore.jpg';
  }

  public onImageLoad(event: Event, skin: Skin): void {
    (skin as SkinWithImageState).imageLoaded = true;
  }

  public onImageError(event: Event, skin: Skin): void {
    const skinWithState = skin as SkinWithImageState;
    skinWithState.imageLoaded = false;
    skinWithState.imageFallbackAttempted = true;
  }

  public async buySkin(listing: MarketListing): Promise<void> {
    if (this.userBalance < listing.price) {
      alert('Insufficient balance!');
      return;
    }

    if (!confirm(`Buy ${listing.skin.name} for $${listing.price}?`)) return;

    try {
      const result = await this.marketService.buySkin(listing.id).toPromise();
      alert('Purchase successful!');

      if (result?.newBalance !== undefined) {
        this.userBalance = result.newBalance;
        this.balanceService.updateBalance(result.newBalance);
      } else {
        await this.loadUserBalance();
      }

      await this.loadMarketData();
    } catch (error) {
      console.error('Error buying skin:', error);
      alert('Purchase failed. Please try again.');
      await this.loadUserBalance();
    }
  }

  public openSellModal(): void {
    this.showSellModal = true;
    this.loadUserSkins();
  }

  public closeSellModal(): void {
    this.showSellModal = false;
    this.selectedSkinToSell = null;
    this.sellForm.reset();
  }

  public selectSkinToSell(skin: SkinInstance): void {
    this.selectedSkinToSell = skin;
    this.sellForm.patchValue({ price: skin.skin.base_price });
  }

  public async listSkinForSale(): Promise<void> {
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

  public clearFilters(): void {
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

  public trackById(index: number, item: MarketListing): number {
    return item.id;
  }

  private readonly rarityBorderColors: Record<string, string> = {
    white: 'border-gray-300/50',
    blue: 'border-blue-400/50',
    dark_blue: 'border-blue-600/50',
    purple: 'border-purple-400/50',
    pink: 'border-pink-400/50',
    red: 'border-red-400/50',
    contraband: 'border-yellow-400/50'
  };

  public getRarityBorderColor(rarity: string): string {
    return this.rarityBorderColors[rarity] || 'border-white/20';
  }
}
