import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(items: { productId: number; quantity: number }[]): Observable<Order> {
    return this.http.post<Order>('/api/orders', { items });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders');
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`/api/orders/${id}`);
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.patch<Order>(`/api/orders/${id}/cancel`, {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`/api/orders/${id}`);
  }
}
