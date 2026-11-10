<?php

namespace Database\Factories;

use App\Models\EmploiDuTemps;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmploiDuTemps>
 */
class EmploiDuTempsFactory extends Factory
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
            'fichier_pdf' => 'emplois-du-temps/'.fake()->uuid().'.pdf',
            'date_sortie' => fake()->date(),
        ];
    }
}
