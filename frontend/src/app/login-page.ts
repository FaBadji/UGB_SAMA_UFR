import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly message = signal('');
  protected readonly loading = signal(false);

  protected login(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    if (!email || !password) {
      this.message.set('Veuillez renseigner votre e-mail et votre mot de passe.');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.auth.login({ email, password }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (!response?.user?.email_verified_at) {
          this.message.set('Connexion réussie. Pensez à vérifier votre e-mail.');
        } else {
          this.message.set('Connexion réussie.');
        }
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.loading.set(false);
        this.message.set(this.extractMessage(error, 'La connexion a échoué.'));
      }
    });
  }

  private extractMessage(error: unknown, fallback: string): string {
    const response = error as {
      error?: { message?: string; errors?: Record<string, string[]> };
      message?: string;
    };

    const validationErrors = response?.error?.errors;
    if (validationErrors) {
      const firstError = Object.values(validationErrors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }

    return response?.error?.message ?? response?.message ?? fallback;
  }
}
