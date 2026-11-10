<?php

namespace Tests\Feature;

use App\Models\Deliberation;
use App\Models\EmploiDuTemps;
use App\Models\Resultat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ContentModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_emploi_du_temps_records_are_stored_with_the_requested_fields(): void
    {
        $emploi = EmploiDuTemps::factory()->create([
            'niveau' => 'Licence 1',
            'filiere' => 'Informatique',
            'fichier_pdf' => 'emplois-du-temps/licence-1.pdf',
            'date_sortie' => '2026-11-10',
        ]);

        $this->assertSame(
            ['id', 'niveau', 'filiere', 'fichier_pdf', 'date_sortie'],
            Schema::getColumnListing('emploi_du_temps')
        );
        $this->assertDatabaseHas('emploi_du_temps', [
            'id' => $emploi->id,
            'filiere' => 'Informatique',
        ]);
        $this->assertSame('2026-11-10', $emploi->refresh()->date_sortie->toDateString());
    }

    public function test_resultat_records_include_subject_and_are_stored(): void
    {
        $resultat = Resultat::factory()->create([
            'niveau' => 'Licence 2',
            'filiere' => 'Mathématiques appliquées',
            'matiere' => 'Algèbre',
            'fichier_pdf' => 'resultats/algebre.pdf',
            'date_sortie' => '2026-11-09',
        ]);

        $this->assertSame(
            ['id', 'niveau', 'filiere', 'matiere', 'fichier_pdf', 'date_sortie'],
            Schema::getColumnListing('resultat')
        );
        $this->assertDatabaseHas('resultat', [
            'id' => $resultat->id,
            'matiere' => 'Algèbre',
            'filiere' => 'Mathématiques appliquées',
        ]);
    }

    public function test_deliberation_records_are_stored_with_the_requested_fields(): void
    {
        $deliberation = Deliberation::factory()->create([
            'niveau' => 'Licence 3',
            'filiere' => 'Informatique',
            'fichier_pdf' => 'deliberations/licence-3.pdf',
            'date_sortie' => '2026-11-08',
        ]);

        $this->assertSame(
            ['id', 'niveau', 'filiere', 'fichier_pdf', 'date_sortie'],
            Schema::getColumnListing('deliberation')
        );
        $this->assertDatabaseHas('deliberation', [
            'id' => $deliberation->id,
            'niveau' => 'Licence 3',
            'filiere' => 'Informatique',
        ]);
    }
}
