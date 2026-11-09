import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  imports: [RouterLink],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css'
})
export class RegistrationPage {
  protected message = '';

  protected register(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    if (data.get('password') !== data.get('passwordConfirmation')) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.message = 'La création de compte n’est pas encore connectée.';
  }
}
