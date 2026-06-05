import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/catalog">🛒 E-Commerce</a>
      <div class="nav-links">
        <a routerLink="/catalog">Products</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/cart">Cart</a>
          <a routerLink="/orders">My Orders</a>
          <a href="#" (click)="logout($event)">Logout ({{ auth.getUsername() }})</a>
        } @else {
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
        }
      </div>
    </nav>
    <main class="container mt-3">
      <router-outlet />
    </main>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  logout(e: Event) {
    e.preventDefault();
    this.auth.logout();
  }
}
