import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { AuthService } from '../auth/auth.service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule],
  template: `
    <h1>Shopping Cart</h1>

    @if (cart.getItems().length === 0) {
      <div class="card mt-2">
        <p>Your cart is empty.</p>
        <a routerLink="/catalog" class="btn btn-primary mt-1">Browse Products</a>
      </div>
    } @else {
      @if (error) {
        <div class="alert alert-error">{{ error }}</div>
      }
      @if (success) {
        <div class="alert alert-success">{{ success }}</div>
      }

      <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <thead>
          <tr style="border-bottom: 2px solid #e5e7eb;">
            <th style="text-align: left; padding: 0.75rem;">Product</th>
            <th style="text-align: center; padding: 0.75rem;">Price</th>
            <th style="text-align: center; padding: 0.75rem;">Qty</th>
            <th style="text-align: right; padding: 0.75rem;">Subtotal</th>
            <th style="padding: 0.75rem;"></th>
          </tr>
        </thead>
        <tbody>
          @for (item of cart.getItems(); track item.product.id) {
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 0.75rem;">{{ item.product.name }}</td>
              <td style="text-align: center; padding: 0.75rem;">{{ item.product.price | currency }}</td>
              <td style="text-align: center; padding: 0.75rem;">
                <input type="number" [ngModel]="item.quantity" (ngModelChange)="cart.updateQuantity(item.product.id, $event)"
                       min="1" style="width: 60px; text-align: center; padding: 0.25rem; border: 1px solid #d1d5db; border-radius: 4px;">
              </td>
              <td style="text-align: right; padding: 0.75rem; font-weight: 600;">{{ item.product.price * item.quantity | currency }}</td>
              <td style="text-align: center; padding: 0.75rem;">
                <button class="btn btn-danger" (click)="cart.removeItem(item.product.id)">Remove</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 1rem;">
        <p style="font-size: 1.25rem; font-weight: 700;">Total: {{ cart.getTotal() | currency }}</p>
        <button class="btn btn-success mt-1" (click)="placeOrder()" [disabled]="placing">
          {{ placing ? 'Placing order...' : 'Place Order' }}
        </button>
      </div>
    }
  `
})
export class CartComponent {
  error = '';
  success = '';
  placing = false;

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  placeOrder() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.placing = true;
    this.error = '';
    this.success = '';

    const items = this.cart.getItems().map(i => ({
      productId: i.product.id,
      quantity: i.quantity
    }));

    this.orderService.createOrder(items).subscribe({
      next: () => {
        this.success = 'Order placed successfully!';
        this.cart.clear();
        this.placing = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to place order.';
        this.placing = false;
      }
    });
  }
}
