import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-verify-email-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './verify-email-page.html',
  styleUrl: './verify-email-page.css'
})
export class VerifyEmailPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Adresse e-mail conservée en mémoire : jamais demandée à l'utilisateur. */
  private email = '';

  protected code = '';
  protected readonly message = signal('');
  protected readonly loading = signal(false);
  protected readonly resending = signal(false);

  ngOnInit(): void {
    // Priorité au paramètre d'URL, sinon l'e-mail mémorisé à l'inscription / connexion.
    this.email = this.route.snapshot.queryParamMap.get('email')
      ?? this.auth.getPendingVerificationEmail()
      ?? '';

    if (this.email) {
      this.auth.setPendingVerificationEmail(this.email);
    }

    if (this.route.snapshot.queryParamMap.get('notice') === 'unverified') {
      this.message.set('Votre adresse e-mail n’est pas encore vérifiée. Saisissez le code reçu ou demandez un nouveau code.');
    }
  }

  protected verify(event: SubmitEvent): void {
    event.preventDefault();

    const code = this.code.trim();

    if (!code) {
      this.message.set('Veuillez saisir le code à 6 chiffres reçu par e-mail.');
      return;
    }

    if (!this.email) {
      this.message.set('Aucune adresse e-mail en attente de vérification. Inscrivez-vous ou connectez-vous pour recevoir un code.');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.auth.verifyEmail({ email: this.email, code }).subscribe({
      next: () => {
        this.loading.set(false);
        this.message.set('E-mail vérifié avec succès.');
        this.auth.clearPendingVerificationEmail();
        setTimeout(() => this.router.navigateByUrl('/connexion'), 1200);
      },
      error: (error) => {
        this.loading.set(false);
        this.message.set(this.extractMessage(error, 'Le code est invalide ou expiré.'));
      }
    });
  }

  protected resend(): void {
    if (this.resending()) {
      return;
    }

    if (!this.email) {
      this.message.set('Aucune adresse e-mail en attente de vérification. Inscrivez-vous ou connectez-vous pour recevoir un code.');
      return;
    }

    this.resending.set(true);
    this.message.set('');

    this.auth.resendVerification(this.email).subscribe({
      next: (response) => {
        this.resending.set(false);
        this.message.set(response?.message ?? 'Un nouveau code a été envoyé.');
      },
      error: (error) => {
        this.resending.set(false);
        this.message.set(this.extractMessage(error, 'Impossible d’envoyer un nouveau code.'));
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
