// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-stickers',
//   standalone: true,
//   imports: [],
//   templateUrl: './stickers.component.html',
//   styleUrl: './stickers.component.css'
// })
// export class StickersComponent {

// }

// src/app/pages/stickers/stickers.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stickers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="text-8xl mb-8">🏷️</div>
      <h2 class="page-title">Stickers</h2>
      <p class="text-gray-400 text-lg mb-8">
        Customize your weapons with unique stickers
      </p>
      <div class="bg-cs-card backdrop-blur-md border border-white/10 rounded-xl p-8 max-w-md">
        <h3 class="text-xl text-cs-blue mb-4">Coming Soon</h3>
        <p class="text-gray-300">
          The stickers page is under development. Soon you'll be able to browse and apply stickers!
        </p>
      </div>
    </div>
  `
})
export class StickersComponent { }