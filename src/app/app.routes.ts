// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route - redirect based on auth state
  { 
    path: '', 
    redirectTo: '/collections', 
    pathMatch: 'full' 
  },

  // Authentication routes (only accessible when NOT logged in)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login.componemt').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register.componemt').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // Protected routes (only accessible when logged in)
  { 
    path: 'collections', 
    loadComponent: () => import('./pages/collections/collections.component').then(m => m.CollectionsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'market', 
    loadComponent: () => import('./pages/market/market.component').then(m => m.MarketComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'stickers', 
    loadComponent: () => import('./pages/stickers/stickers.component').then(m => m.StickersComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'account', 
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard]
  },

  // Wildcard route - redirect to login if not authenticated, collections if authenticated
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];