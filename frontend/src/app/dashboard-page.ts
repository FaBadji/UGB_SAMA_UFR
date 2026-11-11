import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logoutMessage = '';

  protected logout(): void {
    this.logoutMessage = '';
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/connexion'),
      error: (error) => {
        const response = error as { error?: { message?: string }; message?: string };
        this.logoutMessage = response?.error?.message ?? response?.message ?? 'La déconnexion a échoué.';
      }
    });
  }
}
