import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-registration-page',
  imports: [RouterLink],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css'
})
export class RegistrationPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly message = signal('');
  protected readonly loading = signal(false);

  protected register(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const password = String(data.get('password') ?? '');
    const confirmation = String(data.get('passwordConfirmation') ?? '');

    if (password !== confirmation) {
      this.message.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.auth.register({
      email: String(data.get('email') ?? ''),
      password,
      password_confirmation: confirmation,
      filiere: String(data.get('filiere') ?? '')
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        const email = String(data.get('email') ?? '');
        this.auth.setPendingVerificationEmail(email);

        if (response?.requires_email_verification) {
          this.message.set(response.verification_email_sent === false
            ? 'Inscription réussie, mais l’envoi du code a échoué. Utilisez « Renvoyer le code » sur la page suivante.'
            : 'Inscription réussie. Un code de vérification a été envoyé à votre adresse e-mail.');

          setTimeout(() => {
            this.router.navigate(['/verification-email'], { queryParams: { email } });
          }, 1500);
          return;
        }

        this.message.set('Inscription réussie. Votre compte est prêt à être utilisé.');
        setTimeout(() => this.router.navigateByUrl('/connexion'), 1200);
      },
      error: (error) => {
        this.loading.set(false);
        this.message.set(this.extractMessage(error, 'La création de compte a échoué.'));
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
