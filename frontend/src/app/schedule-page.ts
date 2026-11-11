import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SCHEDULE_CARDS, type ScheduleCard } from './schedule-card.data';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-schedule-page',
  imports: [RouterLink],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class SchedulePage {
  private readonly auth = inject(AuthService);

  protected readonly pageTitle: string = 'Emploi du temps';
  protected readonly availableTitle: string = 'Les emplois du temps disponibles';

  protected readonly schedules = SCHEDULE_CARDS;
  protected filteredSchedules = this.schedules;
  protected favorites: string[] = [];

  protected search(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    const level = values.get('niveau');
    const field = values.get('filiere');
    const subject = values.get('matiere');

    this.filteredSchedules = this.schedules.filter((schedule) =>
      (level === '' || schedule.level === level) &&
      (field === '' || schedule.field === field) &&
      (subject === '' || schedule.subject === subject)
    );
  }

  protected toggleFavorite(id: string): void {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((favorite) => favorite !== id)
      : [...this.favorites, id];
  }

  protected isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  protected logout(): void {
    this.auth.logout();
  }
}
