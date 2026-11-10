<?php

namespace Database\Factories;

use App\Models\Deliberation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Deliberation>
 */
class DeliberationFactory extends Factory
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
            'fichier_pdf' => 'deliberations/'.fake()->uuid().'.pdf',
            'date_sortie' => fake()->date(),
        ];
    }
}
