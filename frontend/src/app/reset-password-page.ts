import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-reset-password-page',
  imports: [RouterLink],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css'
})
export class ResetPasswordPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected message = '';
  protected loading = false;
  protected success = false;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  protected reset(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const email = String(data.get('email') ?? this.email ?? '');
    const code = String(data.get('code') ?? '');
    const password = String(data.get('password') ?? '');
    const confirmation = String(data.get('passwordConfirmation') ?? '');

    if (!email || !code || !password) {
      this.message = 'Veuillez renseigner tous les champs.';
      return;
    }

    if (password !== confirmation) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.resetPassword({
      email,
      code,
      password,
      password_confirmation: confirmation
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.message = response?.message ?? 'Mot de passe réinitialisé avec succès.';
        setTimeout(() => this.router.navigateByUrl('/connexion'), 1200);
      },
      error: (error) => {
        this.loading = false;
        const response = error as { error?: { message?: string }; message?: string };
        this.message = response?.error?.message ?? response?.message ?? 'Le code est invalide ou expiré.';
      }
    });
  }
}
