import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from './order.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <h1>My Orders</h1>

    @if (orders.length === 0) {
      <div class="card mt-2">
        <p>You haven't placed any orders yet.</p>
        <a routerLink="/catalog" class="btn btn-primary mt-1">Browse Products</a>
      </div>
    } @else {
      @for (order of orders; track order.id) {
        <div class="card mt-2">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Order #{{ order.id }}</strong>
              <span class="badge"
                [style.background]="order.status === 'Cancelled' ? '#ef4444' : order.status === 'Completed' ? '#22c55e' : '#f59e0b'"
                style="margin-left: 0.5rem; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">
                {{ order.status }}
              </span>
            </div>
            <div style="text-align: right;">
              <p class="price">{{ order.total | currency }}</p>
              <p class="stock">{{ order.createdAt | date:'medium' }}</p>
              @if (order.status === 'Pending') {
                <button class="btn btn-danger" style="margin-top: 0.5rem; font-size: 0.8rem;"
                  (click)="cancelOrder(order)" [disabled]="order.cancelling">
                  {{ order.cancelling ? 'Cancelling...' : 'Cancel Order' }}
                </button>
              }
              @if (order.status === 'Cancelled') {
                <button class="btn btn-danger" style="margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.8;"
                  (click)="removeOrder(order)" [disabled]="order.removing">
                  {{ order.removing ? 'Removing...' : 'Remove' }}
                </button>
              }
            </div>
          </div>
          <table style="width: 100%; margin-top: 0.75rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <th style="text-align: left; padding: 0.4rem 0; font-size: 0.85rem;">Item</th>
                <th style="text-align: center; padding: 0.4rem 0; font-size: 0.85rem;">Qty</th>
                <th style="text-align: right; padding: 0.4rem 0; font-size: 0.85rem;">Price</th>
              </tr>
            </thead>
            <tbody>
              @for (item of order.items; track item.id) {
                <tr>
                  <td style="padding: 0.3rem 0; font-size: 0.9rem;">{{ item.productName }}</td>
                  <td style="text-align: center; padding: 0.3rem 0; font-size: 0.9rem;">{{ item.quantity }}</td>
                  <td style="text-align: right; padding: 0.3rem 0; font-size: 0.9rem;">{{ item.unitPrice * item.quantity | currency }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    }
  `
})
export class OrdersComponent implements OnInit {
  orders: (Order & { cancelling?: boolean; removing?: boolean })[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(o => this.orders = o);
  }

  cancelOrder(order: Order & { cancelling?: boolean }) {
    order.cancelling = true;
    this.orderService.cancelOrder(order.id).subscribe({
      next: (updated) => {
        order.status = updated.status;
        order.cancelling = false;
      },
      error: () => {
        order.cancelling = false;
      }
    });
  }

  removeOrder(order: Order & { removing?: boolean }) {
    order.removing = true;
    this.orderService.deleteOrder(order.id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== order.id);
      },
      error: () => {
        order.removing = false;
      }
    });
  }
}
