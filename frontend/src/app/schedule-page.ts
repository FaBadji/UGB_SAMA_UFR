import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Observable } from 'rxjs';
import { AcademicDocumentsService, type AcademicDocument, type AcademicDocumentFilters } from './academic-documents.service';
import { toAcademicDocumentCards, type AcademicDocumentCard } from './academic-document-card';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-schedule-page',
  imports: [RouterLink],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class SchedulePage implements OnInit {
  private readonly auth = inject(AuthService);

  protected readonly pageTitle: string = 'Emploi du temps';
  protected readonly availableTitle: string = 'Les emplois du temps disponibles';
  protected readonly documentsApi = inject(AcademicDocumentsService);

  protected filteredSchedules: AcademicDocumentCard[] = [];
  protected levels: string[] = [];
  protected fields: string[] = [];
  protected favorites: number[] = [];
  protected isLoading = true;
  protected errorMessage = '';
  private requestSequence = 0;

  ngOnInit(): void {
    this.loadDocuments();
  }

  protected loadDocuments(filters: AcademicDocumentFilters = {}): void {
    this.loadFrom(this.documentsApi.getSchedules(filters), Object.keys(filters).length === 0);
  }

  protected loadFrom(
    documents: Observable<AcademicDocument[]>,
    refreshFilterOptions = false,
  ): void {
    const requestId = ++this.requestSequence;
    this.isLoading = true;
    this.errorMessage = '';

    documents.subscribe({
      next: (records) => {
        if (requestId !== this.requestSequence) {
          return;
        }

        if (refreshFilterOptions) {
          this.levels = [...new Set(records.map((record) => record.niveau))].sort();
          this.fields = [...new Set(records.map((record) => record.filiere))].sort();
        }

        this.filteredSchedules = toAcademicDocumentCards(records);
        this.isLoading = false;
      },
      error: () => {
        if (requestId !== this.requestSequence) {
          return;
        }

        this.errorMessage = 'Impossible de charger les documents. Vérifiez la connexion au serveur.';
        this.isLoading = false;
      },
    });
  }

  protected search(event: SubmitEvent): void {
    event.preventDefault();
    const values = new FormData(event.currentTarget as HTMLFormElement);
    this.loadDocuments({
      niveau: this.formValue(values, 'niveau'),
      filiere: this.formValue(values, 'filiere'),
    });
  }

  protected toggleFavorite(id: number): void {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((favorite) => favorite !== id)
      : [...this.favorites, id];
  }

  protected isFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  private formValue(values: FormData, key: string): string | undefined {
    const value = values.get(key);
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      error: () => {
        // La navigation vers /connexion se fait déjà via routerLink sur le lien.
      },
    });
  }
}
