<?php

namespace App\Models;

use Database\Factories\ResultatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['niveau', 'filiere', 'matiere', 'fichier_pdf', 'date_sortie'])]
class Resultat extends Model
{
    /** @use HasFactory<ResultatFactory> */
    use HasFactory;

    protected $table = 'resultat';

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
