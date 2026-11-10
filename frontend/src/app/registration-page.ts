import { Component, inject } from '@angular/core';
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

  protected message = '';
  protected loading = false;

  protected register(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const password = String(data.get('password') ?? '');
    const confirmation = String(data.get('passwordConfirmation') ?? '');

    if (password !== confirmation) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.register({
      email: String(data.get('email') ?? ''),
      password,
      password_confirmation: confirmation,
      filiere: String(data.get('filiere') ?? '')
    }).subscribe({
      next: (response) => {
        this.loading = false;
        const email = String(data.get('email') ?? '');
        if (response?.user?.email_verified_at) {
          this.message = 'Inscription réussie. Votre compte est prêt à être utilisé.';
          setTimeout(() => this.router.navigateByUrl('/connexion'), 1200);
        } else {
          this.message = 'Inscription réussie. Un code de vérification a été envoyé à votre adresse e-mail.';
          setTimeout(() => {
            this.router.navigate(['/verification-email'], { queryParams: { email } });
          }, 1200);
        }
      },
      error: (error) => {
        this.loading = false;
        this.message = this.extractMessage(error, 'La création de compte a échoué.');
      }
    });
  }

  private extractMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { message?: string }; message?: string };
    return response?.error?.message ?? response?.message ?? fallback;
  }
}
