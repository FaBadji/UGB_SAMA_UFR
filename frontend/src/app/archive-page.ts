import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademicDocumentsService } from './academic-documents.service';
import { toAcademicDocumentCards, type AcademicDocumentCard } from './academic-document-card';
import { AuthService } from './auth.service';

type ArchiveType = 'schedule' | 'deliberations';

@Component({
  selector: 'app-archive-page',
  imports: [RouterLink],
  templateUrl: './archive-page.html',
  styleUrls: ['./schedule-page.css', './archive-page.css']
})
export class ArchivePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly documentsApi = inject(AcademicDocumentsService);
  private archives: AcademicDocumentCard[] = [];
  private searchTerm = '';
  private requestSequence = 0;

  protected filteredSchedules: AcademicDocumentCard[] = [];
  protected archiveType: ArchiveType = 'deliberations';
  protected favorites: number[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadArchives();
  }

  protected setArchiveType(type: ArchiveType): void {
    if (this.archiveType === type) {
      return;
    }

    this.archiveType = type;
    this.loadArchives();
  }

  protected search(event: SubmitEvent): void {
    event.preventDefault();
    const value = new FormData(event.currentTarget as HTMLFormElement).get('search');
    this.searchTerm = typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
    this.applySearch();
  }

  protected toggleFavorite(id: number): void {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((favorite) => favorite !== id)
      : [...this.favorites, id];
  }

  protected isFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  private loadArchives(): void {
    const requestId = ++this.requestSequence;
    const request = this.archiveType === 'schedule'
      ? this.documentsApi.getSchedules()
      : this.documentsApi.getDeliberations();

    this.isLoading = true;
    this.errorMessage = '';
    request.subscribe({
      next: (documents) => {
        if (requestId !== this.requestSequence) {
          return;
        }

        this.archives = toAcademicDocumentCards(documents);
        this.applySearch();
        this.isLoading = false;
      },
      error: () => {
        if (requestId !== this.requestSequence) {
          return;
        }

        this.errorMessage = 'Impossible de charger les archives. Vérifiez la connexion au serveur.';
        this.isLoading = false;
      },
    });
  }

  private applySearch(): void {
    this.filteredSchedules = this.searchTerm
      ? this.archives.filter((document) =>
          [document.title, document.niveau, document.filiere, document.matiere ?? '']
            .some((value) => value.toLocaleLowerCase().includes(this.searchTerm))
        )
      : this.archives;
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      error: () => {
        // La navigation vers /connexion se fait déjà via routerLink sur le lien.
      },
    });
  }
}
