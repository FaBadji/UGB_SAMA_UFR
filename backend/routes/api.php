<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\PasswordResetController;
use Illuminate\Support\Facades\Route;

$register = [AuthController::class, 'register'];
$login = [AuthController::class, 'login'];
$logout = [AuthController::class, 'logout'];
$user = [AuthController::class, 'user'];
$verifySend = [EmailVerificationController::class, 'send'];
$verify = [EmailVerificationController::class, 'verify'];
$forgot = [PasswordResetController::class, 'send'];
$reset = [PasswordResetController::class, 'reset'];

// Registration / login (both common URL styles).
Route::post('auth/register', $register)->middleware('throttle:6,1');
Route::post('register', $register)->middleware('throttle:6,1');
Route::post('auth/login', $login)->middleware('throttle:10,1');
Route::post('login', $login)->middleware('throttle:10,1');

// Password recovery.
Route::post('forgot-password', $forgot)->middleware('throttle:3,1');
Route::post('password/forgot', $forgot)->middleware('throttle:3,1');
Route::post('auth/forgot-password', $forgot)->middleware('throttle:3,1');
Route::post('reset-password', $reset)->middleware('throttle:10,1');
Route::post('password/reset', $reset)->middleware('throttle:10,1');
Route::post('auth/reset-password', $reset)->middleware('throttle:10,1');

// Email verification by code.
Route::post('email/verify', $verify)->middleware('throttle:10,1');
Route::post('verify-email', $verify)->middleware('throttle:10,1');
Route::post('auth/verify-email', $verify)->middleware('throttle:10,1');
Route::post('email/verification-notification', $verifySend)->middleware('throttle:3,1');
Route::post('email/verify/resend', $verifySend)->middleware(['auth:sanctum', 'throttle:3,1']);
Route::post('auth/email/verify/resend', $verifySend)->middleware(['auth:sanctum', 'throttle:3,1']);

// Authenticated routes.
Route::middleware('auth:sanctum')->group(function () use ($logout, $user, $verifySend) {
    Route::post('auth/logout', $logout);
    Route::post('logout', $logout);
    Route::get('user', $user);
    Route::get('auth/user', $user);
    Route::post('email/verification-notification/authenticated', $verifySend)->middleware('throttle:3,1');
});
