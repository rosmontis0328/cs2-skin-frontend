// src/app/pages/collections/collections.component.ts
import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Collection } from "../../models/interfaces";
import { CollectionService } from "../../services/collection.service";

@Component({
  selector: "app-collections",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./collections.component.html",
  styleUrl: "./collections.component.css",
})
export class CollectionsComponent implements OnInit {
  private collectionService = inject(CollectionService);

  collections: Collection[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.loading = true;
    this.error = null;

    this.collectionService.getAllCollections().subscribe({
      next: (collections: Collection[]) => {
        this.collections = collections;
        this.loading = false;
        console.log("Collections loaded:", collections);
      },
      error: (error: any) => {
        this.error = "Failed to load collections";
        this.loading = false;
        console.error("Error loading collections:", error);
      },
    });
  }

  trackById(index: number, item: Collection): number {
    return item.id;
  }
}
