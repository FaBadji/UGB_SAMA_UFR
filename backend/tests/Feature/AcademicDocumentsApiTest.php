<?php

namespace Tests\Feature;

use App\Models\Deliberation;
use App\Models\EmploiDuTemps;
use App\Models\Resultat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AcademicDocumentsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_schedule_endpoint_returns_filtered_documents_and_file_urls(): void
    {
        EmploiDuTemps::factory()->create([
            'niveau' => 'Licence 1',
            'filiere' => 'Informatique',
            'fichier_pdf' => 'emplois-du-temps/l1.pdf',
            'date_sortie' => '2026-11-10',
        ]);
        EmploiDuTemps::factory()->create([
            'niveau' => 'Licence 2',
            'filiere' => 'Physique',
            'fichier_pdf' => 'emplois-du-temps/l2.pdf',
            'date_sortie' => '2026-11-09',
        ]);

        $this->getJson('/api/emplois-du-temps?niveau=Licence%201&filiere=Informatique')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.niveau', 'Licence 1')
            ->assertJsonPath('data.0.filiere', 'Informatique')
            ->assertJsonPath('data.0.fichier_pdf', '/api/emplois-du-temps/1/pdf')
            ->assertJsonPath('data.0.telechargement_pdf', '/api/emplois-du-temps/1/telecharger')
            ->assertJsonMissingPath('data.0.storage_path');
    }

    public function test_result_endpoint_includes_the_subject(): void
    {
        Resultat::factory()->create([
            'niveau' => 'Licence 2',
            'filiere' => 'Mathématiques appliquées',
            'matiere' => 'Algèbre',
            'fichier_pdf' => 'resultats/algebre.pdf',
            'date_sortie' => '2026-11-09',
        ]);

        $this->getJson('/api/resultats?matiere=Alg%C3%A8bre')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.matiere', 'Algèbre');
    }

    public function test_deliberation_endpoint_returns_records_from_its_own_table(): void
    {
        Deliberation::factory()->create([
            'niveau' => 'Licence 3',
            'filiere' => 'Informatique',
            'fichier_pdf' => 'deliberations/l3.pdf',
            'date_sortie' => '2026-11-08',
        ]);

        $this->getJson('/api/deliberations')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.niveau', 'Licence 3')
            ->assertJsonPath('data.0.fichier_pdf', '/api/deliberations/1/pdf');
    }

    public function test_pdf_preview_and_download_serve_only_existing_files(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('emplois-du-temps/l1.pdf', '%PDF-1.4 test document');
        $document = EmploiDuTemps::factory()->create([
            'fichier_pdf' => 'emplois-du-temps/l1.pdf',
        ]);

        $this->get("/api/emplois-du-temps/{$document->id}/pdf")
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');

        $this->get("/api/emplois-du-temps/{$document->id}/telecharger")
            ->assertOk()
            ->assertDownload('l1.pdf');

        $missingDocument = EmploiDuTemps::factory()->create([
            'fichier_pdf' => 'emplois-du-temps/missing.pdf',
        ]);

        $this->getJson("/api/emplois-du-temps/{$missingDocument->id}/pdf")
            ->assertNotFound()
            ->assertJsonPath('message', 'Fichier PDF introuvable.');
    }

    public function test_invalid_filter_values_are_rejected(): void
    {
        $this->getJson('/api/emplois-du-temps?niveau[]=Licence')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('niveau');

        $this->getJson('/api/emplois-du-temps?matiere=Alg%C3%A8bre')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('matiere');
    }
}
