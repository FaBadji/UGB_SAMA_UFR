import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { AcademicDocumentFilters } from './academic-documents.service';
import { SchedulePage } from './schedule-page';

@Component({
  selector: 'app-deliberation-page',
  imports: [RouterLink],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class DeliberationPage extends SchedulePage {
  protected override readonly pageTitle = 'Deliberation';
  protected override readonly availableTitle = 'Les délibérations disponibles';

  protected override loadDocuments(filters: AcademicDocumentFilters = {}): void {
    this.loadFrom(this.documentsApi.getDeliberations(filters), Object.keys(filters).length === 0);
  }
}
