// src/app/pages/collection-detail/collection-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { SkinService } from '../../services/skin.service';
import { Collection, Skin, Rarity } from '../../models/interfaces';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.css'
})
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionService = inject(CollectionService);
  private skinService = inject(SkinService);

  collection: Collection | null = null;
  skins: Skin[] = [];
  rarityStats: { rarity: string; count: number }[] = [];
  loading = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const collectionId = +params['id'];
      if (collectionId) {
        this.loadCollectionDetails(collectionId);
      }
    });
  }

  async loadCollectionDetails(collectionId: number): Promise<void> {
    try {
      this.loading = true;
      
      const [collection, allSkins] = await Promise.all([
        this.collectionService.getCollectionById(collectionId).toPromise(),
        this.skinService.getAllSkins().toPromise()
      ]);

      this.collection = collection!;
      // Filter skins by collection - your database uses collectionid
      this.skins = (allSkins || []).filter(skin => skin.collection?.id === collectionId);
      
      // Initialize image loading state
      this.skins.forEach(skin => (skin as any).imageLoaded = true);
      
      this.calculateRarityStats();
    } catch (error) {
      console.error('Error loading collection details:', error);
    } finally {
      this.loading = false;
    }
  }

  calculateRarityStats(): void {
    const rarityCount: { [key: string]: number } = {};
    
    this.skins.forEach(skin => {
      rarityCount[skin.rarity] = (rarityCount[skin.rarity] || 0) + 1;
    });

    this.rarityStats = Object.entries(rarityCount).map(([rarity, count]) => ({
      rarity,
      count
    }));
  }

  // Updated to work with your database image paths
  getSkinImageUrl(skin: Skin): string {
    // Your database has image_path like "../AWP_Dragon_Lore"
    if (skin.image_path) {
      // Convert your database path to usable URL
      if (skin.image_path.startsWith('../')) {
        // Remove ../ and add proper extension if needed
        const imageName = skin.image_path.replace('../', '');
        return `/assets/skins/${imageName}.jpg`;
      }
      
      // If it's already a full URL
      if (skin.image_path.startsWith('http')) {
        return skin.image_path;
      }
      
      // Use as-is if it's a relative path
      return skin.image_path;
    }
    
    // Fallback: generate from skin name
    const cleanName = skin.name.toLowerCase()
      .replace(/\s*\|\s*/, '_')  // Handle "AWP | Dragon Lore" -> "awp_dragon_lore"
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    return `/assets/skins/${cleanName}.jpg`;
  }

  onImageError(event: any, skin: Skin): void {
    (skin as any).imageLoaded = false;
    console.log(`Image failed to load for: ${skin.name}, tried: ${this.getSkinImageUrl(skin)}`);
  }

  getCollectionGradient(collectionName: string): string {
    const gradients = {
      'ascent': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      'radiant': 'linear-gradient(135deg, #f59e0b, #ef4444)', 
      'boreal': 'linear-gradient(135deg, #10b981, #059669)',
      'train': 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      'fever': 'linear-gradient(135deg, #ef4444, #dc2626)',
      'graphic': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'sport': 'linear-gradient(135deg, #06b6d4, #0891b2)'
    };
    
    const key = collectionName.toLowerCase().split(' ')[1] || collectionName.toLowerCase();
    return gradients[key as keyof typeof gradients] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  }

  getCollectionInitials(name: string): string {
    return name.split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  }

  // Updated for your actual database rarity values
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

  getRarityGradient(rarity: string): string {
    const gradients: { [key: string]: string } = {
      'white': 'linear-gradient(45deg, #d1d5db, #9ca3af)',
      'blue': 'linear-gradient(45deg, #60a5fa, #3b82f6)',
      'dark_blue': 'linear-gradient(45deg, #2563eb, #1d4ed8)',
      'purple': 'linear-gradient(45deg, #a78bfa, #8b5cf6)',
      'pink': 'linear-gradient(45deg, #f472b6, #ec4899)',
      'red': 'linear-gradient(45deg, #f87171, #ef4444)',
      'contraband': 'linear-gradient(45deg, #fbbf24, #f59e0b)'
    };
    return gradients[rarity] || 'linear-gradient(45deg, #6b7280, #4b5563)';
  }

  viewSkinDetails(skin: Skin): void {
    // Navigate to market with search filter
    this.router.navigate(['/market'], { 
      queryParams: { search: skin.name } 
    });
  }

  viewInMarket(skin: Skin): void {
    this.router.navigate(['/market'], { 
      queryParams: { search: skin.name } 
    });
  }

  goBack(): void {
    this.router.navigate(['/collections']);
  }

  trackById(index: number, item: Skin): number {
    return item.id;
  }
}