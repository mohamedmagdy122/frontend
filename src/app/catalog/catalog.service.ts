import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string | null;
  category: Category | null;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private http: HttpClient) {}

  getProducts(categoryId?: number): Observable<Product[]> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return this.http.get<Product[]>(`/api/catalog/products${params}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/catalog/products/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/catalog/products/search?q=${encodeURIComponent(query)}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/catalog/categories');
  }
}
