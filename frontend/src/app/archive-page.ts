import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SCHEDULE_CARDS, type ScheduleCard } from './schedule-card.data';

type ArchiveType = 'schedule' | 'deliberations';

@Component({
  selector: 'app-archive-page',
  imports: [RouterLink],
  templateUrl: './archive-page.html',
  styleUrls: ['./schedule-page.css', './archive-page.css']
})
export class ArchivePage {
  protected readonly schedules = SCHEDULE_CARDS;
  protected filteredSchedules: readonly ScheduleCard[] = this.schedules;
  protected archiveType: ArchiveType = 'deliberations';
  protected favorites: string[] = [];

  protected setArchiveType(type: ArchiveType): void {
    this.archiveType = type;
  }

  protected search(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const term = new FormData(form).get('search')?.toString().trim().toLocaleLowerCase();

    this.filteredSchedules = term
      ? this.schedules.filter((schedule) =>
          [schedule.title, schedule.level, schedule.field, schedule.subject]
            .some((value) => value.toLocaleLowerCase().includes(term))
        )
      : this.schedules;
  }

  protected toggleFavorite(id: string): void {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((favorite) => favorite !== id)
      : [...this.favorites, id];
  }

  protected isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }
}
