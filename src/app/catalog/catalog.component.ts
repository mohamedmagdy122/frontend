import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService, Product, Category } from './catalog.service';
import { CartService } from '../orders/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  template: `
    <h1>Product Catalog</h1>

    <div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap; align-items: center;">
      <input
        [(ngModel)]="searchQuery"
        (keyup.enter)="onSearch()"
        placeholder="Search products..."
        style="flex: 1; min-width: 200px; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;"
      >
      <button class="btn btn-primary" (click)="onSearch()">Search</button>
      <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()" style="padding: 0.5rem; border-radius: 6px; border: 1px solid #d1d5db;">
        <option [ngValue]="undefined">All Categories</option>
        @for (cat of categories; track cat.id) {
          <option [ngValue]="cat.id">{{ cat.name }}</option>
        }
      </select>
    </div>

    <div class="product-grid">
      @for (product of products; track product.id) {
        <div class="card">
          <h3><a [routerLink]="['/catalog', product.id]">{{ product.name }}</a></h3>
          <p class="stock">{{ product.category?.name }}</p>
          <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #4b5563;">
            {{ product.description }}
          </p>
          <p class="price">{{ product.price | currency }}</p>
          <p class="stock">Stock: {{ product.stock }}</p>
          <button class="btn btn-success mt-1" (click)="addToCart(product)" [disabled]="product.stock === 0 || addedMap[product.id]"
            [style.background]="addedMap[product.id] ? '#22c55e' : ''"
            [style.transform]="addedMap[product.id] ? 'scale(0.95)' : ''">
            {{ product.stock === 0 ? 'Out of Stock' : addedMap[product.id] ? '✓ Added!' : 'Add to Cart' }}
          </button>
        </div>
      } @empty {
        <p>No products found.</p>
      }
    </div>
  `
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory?: number;
  addedMap: Record<number, boolean> = {};

  constructor(private catalogService: CatalogService, private cartService: CartService) {}

  ngOnInit() {
    this.loadProducts();
    this.catalogService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadProducts() {
    this.catalogService.getProducts(this.selectedCategory).subscribe(p => this.products = p);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.catalogService.searchProducts(this.searchQuery).subscribe(p => this.products = p);
    } else {
      this.loadProducts();
    }
  }

  onCategoryChange() {
    this.searchQuery = '';
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
    this.addedMap[product.id] = true;
    setTimeout(() => this.addedMap[product.id] = false, 1500);
  }
}
