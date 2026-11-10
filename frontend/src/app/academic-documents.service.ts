import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';

export interface AcademicDocument {
  id: number;
  niveau: string;
  filiere: string;
  matiere?: string;
  fichier_pdf: string;
  telechargement_pdf: string;
  date_sortie: string;
}

export interface AcademicDocumentFilters {
  niveau?: string;
  filiere?: string;
  matiere?: string;
}

interface ApiCollection<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class AcademicDocumentsService {
  private readonly http = inject(HttpClient);

  getSchedules(filters: AcademicDocumentFilters = {}): Observable<AcademicDocument[]> {
    return this.getCollection('/api/emplois-du-temps', filters);
  }

  getResults(filters: AcademicDocumentFilters = {}): Observable<AcademicDocument[]> {
    return this.getCollection('/api/resultats', filters);
  }

  getDeliberations(filters: AcademicDocumentFilters = {}): Observable<AcademicDocument[]> {
    return this.getCollection('/api/deliberations', filters);
  }

  private getCollection(
    endpoint: string,
    filters: AcademicDocumentFilters,
  ): Observable<AcademicDocument[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }

    return this.http
      .get<ApiCollection<AcademicDocument>>(endpoint, { params })
      .pipe(map((response) => response.data));
  }
}
