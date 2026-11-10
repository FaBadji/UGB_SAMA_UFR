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
Route::post('auth/register', $register);
Route::post('register', $register);
Route::post('auth/login', $login);
Route::post('login', $login);

// Password recovery.
Route::post('forgot-password', $forgot);
Route::post('password/forgot', $forgot);
Route::post('auth/forgot-password', $forgot);
Route::post('reset-password', $reset);
Route::post('password/reset', $reset);
Route::post('auth/reset-password', $reset);

// Email verification by code.
Route::post('email/verify', $verify);
Route::post('verify-email', $verify);
Route::post('auth/verify-email', $verify);
Route::post('email/verification-notification', $verifySend);
Route::post('email/verify/resend', $verifySend)->middleware('auth:sanctum');
Route::post('auth/email/verify/resend', $verifySend)->middleware('auth:sanctum');

// Authenticated routes.
Route::middleware('auth:sanctum')->group(function () use ($logout, $user, $verifySend) {
    Route::post('auth/logout', $logout);
    Route::post('logout', $logout);
    Route::get('user', $user);
    Route::get('auth/user', $user);
    Route::post('email/verification-notification/authenticated', $verifySend);
});

