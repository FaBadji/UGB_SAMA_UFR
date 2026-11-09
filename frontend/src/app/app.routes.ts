import { Routes } from '@angular/router';
import { HomePage } from './app';
import { RegistrationPage } from './registration-page';
import { LoginPage } from './login-page';
import { DashboardPage } from './dashboard-page';
import { SchedulePage } from './schedule-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'inscription', component: RegistrationPage },
  { path: 'connexion', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  { path: 'emploi-du-temps', component: SchedulePage },
  { path: '**', redirectTo: '' }
];
