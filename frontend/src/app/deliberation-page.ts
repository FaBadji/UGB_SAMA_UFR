import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SchedulePage } from './schedule-page';

@Component({
  selector: 'app-deliberation-page',
  imports: [RouterLink],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class DeliberationPage extends SchedulePage {
  protected override readonly pageTitle = 'Deliberation';
  protected override readonly availableTitle = 'Les emplois du temps disponibles';
}
