import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService, Product } from './catalog.service';
import { CartService } from '../orders/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    @if (product) {
      <div class="card" style="max-width: 600px; margin: 2rem auto;">
        <a routerLink="/catalog">&larr; Back to catalog</a>
        <h2 class="mt-2">{{ product.name }}</h2>
        <p class="stock mt-1">{{ product.category?.name }}</p>
        <p style="margin: 1rem 0;">{{ product.description }}</p>
        <p class="price" style="font-size: 1.5rem;">{{ product.price | currency }}</p>
        <p class="stock mb-2">Stock: {{ product.stock }}</p>
        <button class="btn btn-success" (click)="addToCart()" [disabled]="product.stock === 0">
          {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
      </div>
    }
  `
})
export class ProductDetailComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getProduct(id).subscribe(p => this.product = p);
  }

  addToCart() {
    if (this.product) this.cartService.addItem(this.product);
  }
}
