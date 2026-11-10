import type { AcademicDocument } from './academic-documents.service';

const CARD_IMAGES = [
  '/images/schedule-card-optics.png',
  '/images/schedule-card-mathematics.png',
  '/images/schedule-card-computing.png',
] as const;

export interface AcademicDocumentCard extends AcademicDocument {
  title: string;
  image: string;
  status: string;
}

export function toAcademicDocumentCards(
  documents: AcademicDocument[],
): AcademicDocumentCard[] {
  return documents.map((document, index) => ({
    ...document,
    title: document.matiere
      ? `${document.matiere} - ${document.niveau}`
      : `${document.filiere} - ${document.niveau}`,
    image: CARD_IMAGES[index % CARD_IMAGES.length],
    status: `Publié le ${document.date_sortie}`,
  }));
}
