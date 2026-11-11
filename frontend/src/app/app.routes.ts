import { Routes } from '@angular/router';
import { HomePage } from './app';
import { RegistrationPage } from './registration-page';
import { LoginPage } from './login-page';
import { DashboardPage } from './dashboard-page';
import { SchedulePage } from './schedule-page';
import { DeliberationPage } from './deliberation-page';
import { ArchivePage } from './archive-page';
import { VerifyEmailPage } from './verify-email-page';
import { ForgotPasswordPage } from './forgot-password-page';
import { ResetPasswordPage } from './reset-password-page';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'inscription', component: RegistrationPage },
  { path: 'connexion', component: LoginPage },
  { path: 'verification-email', component: VerifyEmailPage },
  { path: 'mot-de-passe-oublie', component: ForgotPasswordPage },
  { path: 'reinitialiser-mot-de-passe', component: ResetPasswordPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'emploi-du-temps', component: SchedulePage, canActivate: [authGuard] },
  { path: 'deliberation', component: DeliberationPage, canActivate: [authGuard] },
  { path: 'archives', component: ArchivePage, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
