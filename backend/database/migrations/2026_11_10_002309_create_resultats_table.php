<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resultat', function (Blueprint $table) {
            $table->id();
            $table->string('niveau');
            $table->string('filiere');
            $table->string('matiere');
            $table->string('fichier_pdf');
            $table->date('date_sortie');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultat');
    }
};
