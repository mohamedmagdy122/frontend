import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  { path: 'catalog', loadComponent: () => import('./catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'catalog/:id', loadComponent: () => import('./catalog/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'orders', loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'cart', loadComponent: () => import('./orders/cart.component').then(m => m.CartComponent) },
  { path: '**', redirectTo: 'catalog' }
];
