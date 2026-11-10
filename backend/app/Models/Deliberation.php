<?php

namespace App\Models;

use Database\Factories\DeliberationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['niveau', 'filiere', 'fichier_pdf', 'date_sortie'])]
class Deliberation extends Model
{
    /** @use HasFactory<DeliberationFactory> */
    use HasFactory;

    protected $table = 'deliberation';

    public $timestamps = false;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_sortie' => 'date',
        ];
    }
}
