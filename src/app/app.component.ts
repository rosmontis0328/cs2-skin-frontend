// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  title = 'cs2-skin-frontend';

  ngOnInit(): void {
    // Handle initial routing based on auth state
    this.handleInitialRouting();
  }

  private handleInitialRouting(): void {
    const currentUrl = this.router.url;
    const isLoggedIn = this.authService.isLoggedIn();
    
    // If user is on root path, redirect appropriately
    if (currentUrl === '/') {
      if (isLoggedIn) {
        this.router.navigate(['/collections']);
      } else {
        this.router.navigate(['/login']);
      }
    }
    
    // If user is not logged in and trying to access protected routes
    const protectedRoutes = ['/collections', '/market', '/stickers', '/account'];
    if (!isLoggedIn && protectedRoutes.some(route => currentUrl.startsWith(route))) {
      this.router.navigate(['/login']);
    }
    
    // If user is logged in and trying to access auth routes
    const authRoutes = ['/login', '/register'];
    if (isLoggedIn && authRoutes.some(route => currentUrl.startsWith(route))) {
      this.router.navigate(['/collections']);
    }
  }
}