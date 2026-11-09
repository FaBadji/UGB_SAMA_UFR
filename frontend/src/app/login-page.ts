import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  protected message = '';

  protected login(event: SubmitEvent): void {
    event.preventDefault();
    this.message = 'La connexion n’est pas encore reliée au serveur.';
  }
}
