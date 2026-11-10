<?php

namespace App\Models;

use Database\Factories\EmploiDuTempsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['niveau', 'filiere', 'fichier_pdf', 'date_sortie'])]
class EmploiDuTemps extends Model
{
    /** @use HasFactory<EmploiDuTempsFactory> */
    use HasFactory;

    protected $table = 'emploi_du_temps';

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
