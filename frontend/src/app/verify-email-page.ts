import { Component, OnInit, inject } from '@angular/core';
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

  protected email = '';
  protected code = '';
  protected message = '';
  protected loading = false;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  protected verify(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.email || !this.code) {
      this.message = 'Veuillez renseigner votre e-mail et le code reçu.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.verifyEmail({ email: this.email, code: this.code }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'E-mail vérifié avec succès.';
        setTimeout(() => this.router.navigateByUrl('/connexion'), 1200);
      },
      error: (error) => {
        this.loading = false;
        this.message = this.extractMessage(error, 'Le code est invalide ou expiré.');
      }
    });
  }

  protected resend(): void {
    if (!this.email) {
      this.message = 'Veuillez renseigner votre e-mail.';
      return;
    }

    this.auth.resendVerification(this.email).subscribe({
      next: (response) => {
        this.message = response?.message ?? 'Un nouveau code a été envoyé.';
      },
      error: (error) => {
        this.message = this.extractMessage(error, 'Impossible d’envoyer un nouveau code.');
      }
    });
  }

  private extractMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { message?: string }; message?: string };
    return response?.error?.message ?? response?.message ?? fallback;
  }
}
