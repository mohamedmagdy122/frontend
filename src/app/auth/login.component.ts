import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card" style="max-width: 400px; margin: 2rem auto;">
        <h2>Login</h2>
        @if (error) {
          <div class="alert alert-error">{{ error }}</div>
        }
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" [(ngModel)]="username" name="username" required autocomplete="username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="password" name="password" required autocomplete="current-password">
          </div>
          <button class="btn btn-primary" style="width:100%" type="submit" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="mt-2 text-center">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => { this.router.navigate(['/catalog']); },
      error: (err) => {
        this.error = err.error?.message || 'Login failed.';
        this.loading = false;
      }
    });
  }
}
