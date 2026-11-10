import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePage } from './app';
import { RegistrationPage } from './registration-page';
import { LoginPage } from './login-page';
import { DashboardPage } from './dashboard-page';
import { SchedulePage } from './schedule-page';
import { DeliberationPage } from './deliberation-page';
import { ArchivePage } from './archive-page';
import { routes } from './app.routes';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the student portal homepage', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Bienvenue à');
    expect(compiled.querySelector('#resultats')).toBeTruthy();
    expect(compiled.querySelector('.hero-button')?.textContent).toContain('S’inscrire');
    expect(compiled.querySelector('#archives img[src="/images/campus-angle.jpg"]')).toBeTruthy();
    expect(compiled.querySelector('#mission img[src="/images/cour-interieure.png"]')).toBeTruthy();
    expect(compiled.querySelector('.site-header .brand img[src="/images/sama-ufr-logo.png"]')).toBeTruthy();
    expect(compiled.querySelector('.header-space')?.getAttribute('href')).toBe('/dashboard');
    expect(compiled.querySelector('#contact form')).toBeTruthy();
  });

  it('should clarify that the contact form is not connected yet', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.form-status')?.textContent).toContain(
      'Le formulaire de contact n’est pas encore connecté.',
    );
  });
});

describe('RegistrationPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationPage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render the registration fields and link from the homepage', async () => {
    const fixture = TestBed.createComponent(RegistrationPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Inscription en');
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('select[name="filiere"]')).toBeTruthy();
    expect(compiled.querySelectorAll('input[type="password"]')).toHaveLength(2);
    expect(compiled.querySelector('button[type="submit"]')?.textContent).toContain('Inscription');
    expect(compiled.querySelector('.registration-brand')).toBeNull();
  });

  it('should report when the passwords do not match', async () => {
    const fixture = TestBed.createComponent(RegistrationPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const password = compiled.querySelector('[name="password"]') as HTMLInputElement;
    const confirmation = compiled.querySelector('[name="passwordConfirmation"]') as HTMLInputElement;
    password.value = 'first-password';
    confirmation.value = 'different-password';
    compiled.querySelector('form')?.dispatchEvent(
      new SubmitEvent('submit', { bubbles: true, cancelable: true })
    );
    fixture.detectChanges();

    expect(compiled.querySelector('.registration-message')?.textContent).toContain(
      'Les mots de passe ne correspondent pas.'
    );
  });
});

describe('LoginPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render the login design and required fields', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.login-intro h1')?.textContent).toContain('Mon espace');
    expect(compiled.querySelector('.login-logo')?.getAttribute('src')).toBe('/images/sama-ufr-logo.png');
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')?.textContent).toContain('Connexion');
    expect(compiled.querySelector('.register-prompt')?.textContent).toContain('Pas de compte ?');
    expect(compiled.querySelector('.register-prompt a')?.getAttribute('href')).toBe('/inscription');
    expect(compiled.querySelector('.register-prompt a')?.textContent).toContain('Inscription');
  });

  it('should be available at the connexion route', () => {
    expect(routes.find((route) => route.path === 'connexion')?.component).toBe(LoginPage);
  });

  it('should ask for credentials when the form is empty', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.login-message')?.textContent).toContain(
      'Veuillez renseigner votre e-mail et votre mot de passe.'
    );
  });
});

describe('DashboardPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render the student dashboard and its main actions', async () => {
    const fixture = TestBed.createComponent(DashboardPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.welcome-banner h1')?.textContent).toContain('Bienvenue , Fatou');
    expect(compiled.querySelector('.dashboard-brand img')?.getAttribute('src')).toBe('/images/sama-ufr-logo.png');
    expect(compiled.querySelector('.dashboard-nav a[href="/deliberation"]')?.textContent).toContain('Résultats');
    expect(compiled.querySelectorAll('.filter-option')).toHaveLength(3);
    expect(compiled.querySelector('.schedule-card')?.getAttribute('href')).toBe('/emploi-du-temps');
    expect(compiled.querySelector('#resultats')?.getAttribute('href')).toBe('/deliberation');
  });

  it('should be available at the dashboard route', () => {
    expect(routes.find((route) => route.path === 'dashboard')?.component).toBe(DashboardPage);
  });
});

describe('SchedulePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulePage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render the schedule filters and three schedule cards', async () => {
    const fixture = TestBed.createComponent(SchedulePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#schedule-title')?.textContent).toContain('Emploi du temps');
    expect(compiled.querySelector('.schedule-nav a[href="/deliberation"]')?.textContent).toContain('Résultats');
    expect(compiled.querySelectorAll('.schedule-filters select')).toHaveLength(3);
    expect(compiled.querySelectorAll('.schedule-card')).toHaveLength(3);
    expect(compiled.querySelector('.schedule-card[style*="schedule-card-optics.png"]')).toBeTruthy();
  });

  it('should filter the schedules and allow favoriting a card', async () => {
    const fixture = TestBed.createComponent(SchedulePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('.schedule-filters') as HTMLFormElement;
    const level = compiled.querySelector('[name="niveau"]') as HTMLSelectElement;
    const field = compiled.querySelector('[name="filiere"]') as HTMLSelectElement;
    const subject = compiled.querySelector('[name="matiere"]') as HTMLSelectElement;

    level.value = 'Licence 3';
    field.value = 'Info';
    subject.value = 'Administration de base de données';
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.schedule-card')).toHaveLength(1);
    expect(compiled.querySelector('.card-information strong')?.textContent).toContain('Informatique - L3SI');

    const favorite = compiled.querySelector('.favorite-button') as HTMLButtonElement;
    favorite.click();
    fixture.detectChanges();
    expect(favorite.getAttribute('aria-pressed')).toBe('true');
  });

  it('should be available at the emploi-du-temps route', () => {
    expect(routes.find((route) => route.path === 'emploi-du-temps')?.component).toBe(SchedulePage);
  });
});

describe('DeliberationPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliberationPage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render deliberations with the schedule page design and filters', async () => {
    const fixture = TestBed.createComponent(DeliberationPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#schedule-title')?.textContent).toContain('Deliberation');
    expect(compiled.querySelector('.available-title')?.textContent).toContain('Les emplois du temps disponibles');
    expect(compiled.querySelectorAll('.schedule-filters select')).toHaveLength(3);
    expect(compiled.querySelectorAll('.schedule-card')).toHaveLength(3);
  });

  it('should be available at the deliberation route', () => {
    expect(routes.find((route) => route.path === 'deliberation')?.component).toBe(DeliberationPage);
  });
});

describe('ArchivePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivePage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should render the archive banner, type switch, search, and cards', async () => {
    const fixture = TestBed.createComponent(ArchivePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.archive-hero h1')?.textContent).toContain('Bienvenue sur les archives');
    expect(compiled.querySelectorAll('.archive-type-options button')).toHaveLength(2);
    expect(compiled.querySelector('[name="search"]')).toBeTruthy();
    expect(compiled.querySelectorAll('.archive-cards .schedule-card')).toHaveLength(3);
    expect(compiled.querySelector('.schedule-nav a[href="/deliberation"]')?.textContent).toContain('Résultats');
    expect(compiled.querySelector('.schedule-nav .active')?.textContent).toContain('Archives');
  });

  it('should switch archive type and search the available cards', async () => {
    const fixture = TestBed.createComponent(ArchivePage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const typeButton = compiled.querySelector('.archive-type-options button:first-child') as HTMLButtonElement;
    typeButton.click();
    fixture.detectChanges();
    expect(typeButton.getAttribute('aria-pressed')).toBe('true');

    const form = compiled.querySelector('.archive-search') as HTMLFormElement;
    const query = compiled.querySelector('[name="search"]') as HTMLInputElement;
    query.value = 'Mathématiques';
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.archive-cards .schedule-card')).toHaveLength(1);
    expect(compiled.querySelector('.card-information strong')?.textContent).toContain('Mathématiques');
  });

  it('should be available at the archives route', () => {
    expect(routes.find((route) => route.path === 'archives')?.component).toBe(ArchivePage);
  });
});
