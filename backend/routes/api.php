<?php

use App\Http\Controllers\Api\AcademicDocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/emplois-du-temps', [AcademicDocumentController::class, 'schedules']);
Route::get('/emplois-du-temps/{emploiDuTemps}/pdf', [AcademicDocumentController::class, 'previewSchedule'])
    ->whereNumber('emploiDuTemps')
    ->name('api.emploi-du-temps.pdf');
Route::get('/emplois-du-temps/{emploiDuTemps}/telecharger', [AcademicDocumentController::class, 'downloadSchedule'])
    ->whereNumber('emploiDuTemps')
    ->name('api.emploi-du-temps.download');

Route::get('/resultats', [AcademicDocumentController::class, 'results']);
Route::get('/resultats/{resultat}/pdf', [AcademicDocumentController::class, 'previewResult'])
    ->whereNumber('resultat')
    ->name('api.resultats.pdf');
Route::get('/resultats/{resultat}/telecharger', [AcademicDocumentController::class, 'downloadResult'])
    ->whereNumber('resultat')
    ->name('api.resultats.download');

Route::get('/deliberations', [AcademicDocumentController::class, 'deliberations']);
Route::get('/deliberations/{deliberation}/pdf', [AcademicDocumentController::class, 'previewDeliberation'])
    ->whereNumber('deliberation')
    ->name('api.deliberations.pdf');
Route::get('/deliberations/{deliberation}/telecharger', [AcademicDocumentController::class, 'downloadDeliberation'])
    ->whereNumber('deliberation')
    ->name('api.deliberations.download');
