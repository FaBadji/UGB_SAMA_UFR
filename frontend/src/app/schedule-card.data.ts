export interface ScheduleCard {
  id: string;
  title: string;
  image: string;
  status: string;
  level: string;
  field: string;
  subject: string;
}

export const SCHEDULE_CARDS: readonly ScheduleCard[] = [
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
