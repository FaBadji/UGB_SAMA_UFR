import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ScheduleCard {
  id: string;
  title: string;
  image: string;
  status: string;
  level: string;
  field: string;
  subject: string;
}

@Component({
  selector: 'app-schedule-page',
  imports: [RouterLink],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class SchedulePage {
  protected readonly schedules: ScheduleCard[] = [
    {
      id: 'optique',
      title: 'Optique géométrie',
      image: '/images/schedule-card-optics.png',
      status: 'Pas encore consulté',
      level: 'Licence 1',
      field: 'Physique',
      subject: 'Optique géométrie'
    },
    {
      id: 'mathematiques',
      title: 'Mathématiques - L2 MA',
      image: '/images/schedule-card-mathematics.png',
      status: 'Pas encore consulté',
      level: 'Licence 2',
      field: 'Mathématiques appliquées',
      subject: 'Mathématiques'
    },
    {
      id: 'informatique',
      title: 'Informatique - L3SI',
      image: '/images/schedule-card-computing.png',
      status: '1 fois consulté',
      level: 'Licence 3',
      field: 'Info',
      subject: 'Administration de base de données'
    }
  ];

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
}
