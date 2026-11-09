import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class App {}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home.html'
})
export class HomePage {
  protected contactMessage = '';

  protected submitContact(event: SubmitEvent): void {
    event.preventDefault();
    this.contactMessage = 'Le formulaire de contact n’est pas encore connecté.';
  }
}
