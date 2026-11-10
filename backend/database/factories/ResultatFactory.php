<?php

namespace Database\Factories;

use App\Models\Resultat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Resultat>
 */
class ResultatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'niveau' => fake()->randomElement(['Licence 1', 'Licence 2', 'Licence 3']),
            'filiere' => fake()->randomElement(['Informatique', 'Physique', 'Mathématiques appliquées']),
            'matiere' => fake()->words(3, true),
            'fichier_pdf' => 'resultats/'.fake()->uuid().'.pdf',
            'date_sortie' => fake()->date(),
        ];
    }
}
