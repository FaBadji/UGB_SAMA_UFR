import { Component, inject } from '@angular/core';
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

  protected message = '';
  protected loading = false;

  protected login(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    if (!email || !password) {
      this.message = 'Veuillez renseigner votre e-mail et votre mot de passe.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Connexion réussie.';
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.loading = false;

        const response = error as {
          status?: number;
          error?: { message?: string; requires_email_verification?: boolean };
          message?: string;
        };

        if (response.status === 403 && response.error?.requires_email_verification) {
          this.router.navigate(['/verification-email'], {
            queryParams: { email, notice: 'unverified' }
          });
          return;
        }

        this.message = this.extractMessage(error, 'La connexion a échoué.');
      }
    });
  }

  private extractMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { message?: string }; message?: string };
    return response?.error?.message ?? response?.message ?? fallback;
  }
}
