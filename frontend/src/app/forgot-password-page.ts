import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [RouterLink],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css'
})
export class ForgotPasswordPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected message = '';
  protected loading = false;
  protected submittedEmail = '';

  protected sendCode(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '');

    if (!email) {
      this.message = 'Veuillez renseigner votre e-mail.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.forgotPassword(email).subscribe({
      next: (response) => {
        this.loading = false;
        this.submittedEmail = email;
        this.message = response?.message ?? 'Un code de réinitialisation a été envoyé.';
      },
      error: (error) => {
        this.loading = false;
        const response = error as { error?: { message?: string }; message?: string };
        this.message = response?.error?.message ?? response?.message ?? 'Impossible d’envoyer le code.';
      }
    });
  }

  protected goToReset(): void {
    if (this.submittedEmail) {
      this.router.navigate(['/reinitialiser-mot-de-passe'], { queryParams: { email: this.submittedEmail } });
    }
  }
}
