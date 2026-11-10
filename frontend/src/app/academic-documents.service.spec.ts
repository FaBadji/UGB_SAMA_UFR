import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AcademicDocumentsService } from './academic-documents.service';

describe('AcademicDocumentsService', () => {
  let service: AcademicDocumentsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AcademicDocumentsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('requests filtered schedules and unwraps the API collection', () => {
    let response: unknown;
    service.getSchedules({ niveau: 'Licence 1', filiere: 'Informatique' }).subscribe((documents) => {
      response = documents;
    });

    const request = http.expectOne((candidate) =>
      candidate.url === '/api/emplois-du-temps' &&
      candidate.params.get('niveau') === 'Licence 1' &&
      candidate.params.get('filiere') === 'Informatique'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ data: [{ id: 1, niveau: 'Licence 1', filiere: 'Informatique' }] });

    expect(response).toEqual([{ id: 1, niveau: 'Licence 1', filiere: 'Informatique' }]);
  });

  it('uses the dedicated results and deliberations endpoints', () => {
    service.getResults().subscribe();
    service.getDeliberations().subscribe();

    http.expectOne('/api/resultats').flush({ data: [] });
    http.expectOne('/api/deliberations').flush({ data: [] });
  });
});
