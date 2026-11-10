<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deliberation;
use App\Models\EmploiDuTemps;
use App\Models\Resultat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AcademicDocumentController extends Controller
{
    public function schedules(Request $request): JsonResponse
    {
        return $this->collection(
            $this->filteredQuery($request, EmploiDuTemps::query())->get(),
            'api.emploi-du-temps.pdf',
            'api.emploi-du-temps.download',
        );
    }

    public function results(Request $request): JsonResponse
    {
        return $this->collection(
            $this->filteredQuery($request, Resultat::query(), true)->get(),
            'api.resultats.pdf',
            'api.resultats.download',
        );
    }

    public function deliberations(Request $request): JsonResponse
    {
        return $this->collection(
            $this->filteredQuery($request, Deliberation::query())->get(),
            'api.deliberations.pdf',
            'api.deliberations.download',
        );
    }

    public function previewSchedule(EmploiDuTemps $emploiDuTemps): BinaryFileResponse
    {
        return $this->preview($emploiDuTemps);
    }

    public function downloadSchedule(EmploiDuTemps $emploiDuTemps): StreamedResponse
    {
        return $this->download($emploiDuTemps);
    }

    public function previewResult(Resultat $resultat): BinaryFileResponse
    {
        return $this->preview($resultat);
    }

    public function downloadResult(Resultat $resultat): StreamedResponse
    {
        return $this->download($resultat);
    }

    public function previewDeliberation(Deliberation $deliberation): BinaryFileResponse
    {
        return $this->preview($deliberation);
    }

    public function downloadDeliberation(Deliberation $deliberation): StreamedResponse
    {
        return $this->download($deliberation);
    }

    /**
     * @param  Builder<Model>  $query
     * @return Builder<Model>
     */
    private function filteredQuery(Request $request, Builder $query, bool $hasSubject = false): Builder
    {
        $rules = [
            'niveau' => ['sometimes', 'nullable', 'string', 'max:255'],
            'filiere' => ['sometimes', 'nullable', 'string', 'max:255'],
            'matiere' => $hasSubject
                ? ['sometimes', 'nullable', 'string', 'max:255']
                : ['prohibited'],
        ];

        $filters = $request->validate($rules);

        foreach (array_keys($rules) as $field) {
            if (! empty($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        return $query->orderByDesc('date_sortie')->orderByDesc('id');
    }

    /**
     * @param  iterable<Model>  $documents
     */
    private function collection(iterable $documents, string $previewRoute, string $downloadRoute): JsonResponse
    {
        $data = [];

        foreach ($documents as $document) {
            $data[] = $this->formatDocument($document, $previewRoute, $downloadRoute);
        }

        return response()->json(['data' => $data]);
    }

    /**
     * @return array<string, int|string>
     */
    private function formatDocument(Model $document, string $previewRoute, string $downloadRoute): array
    {
        $data = [
            'id' => (int) $document->getKey(),
            'niveau' => (string) $document->getAttribute('niveau'),
            'filiere' => (string) $document->getAttribute('filiere'),
            'date_sortie' => $document->getAttribute('date_sortie')->toDateString(),
            'fichier_pdf' => route($previewRoute, $document->getKey(), false),
            'telechargement_pdf' => route($downloadRoute, $document->getKey(), false),
        ];

        if ($document instanceof Resultat) {
            $data['matiere'] = $document->matiere;
        }

        return $data;
    }

    private function preview(Model $document): BinaryFileResponse
    {
        $path = $this->availablePdfPath($document);

        return response()->file(Storage::disk('public')->path($path), [
            'Content-Type' => 'application/pdf',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function download(Model $document): StreamedResponse
    {
        $path = $this->availablePdfPath($document);

        return Storage::disk('public')->download(
            $path,
            basename($path),
            ['Content-Type' => 'application/pdf', 'X-Content-Type-Options' => 'nosniff'],
        );
    }

    private function availablePdfPath(Model $document): string
    {
        $path = $document->getAttribute('fichier_pdf');

        abort_unless(
            is_string($path) && str_ends_with(strtolower($path), '.pdf') && Storage::disk('public')->exists($path),
            404,
            'Fichier PDF introuvable.',
        );

        return $path;
    }
}
