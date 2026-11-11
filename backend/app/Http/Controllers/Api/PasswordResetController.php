<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PasswordResetController
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if ($user) {
            try {
                $user->sendPasswordResetCode();
            } catch (Throwable $exception) {
                // Keep the response generic so mail issues do not leak account existence.
                report($exception);
            }
        }

        return response()->json([
            'message' => 'Si un compte existe pour cette adresse, un code de réinitialisation a été envoyé.',
        ]);
    }

    public function reset(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'code' => ['required', 'digits:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('email', $data['email'])->firstOrFail();

        if (! $user->resetPasswordWithCode($data['code'], $data['password'])) {
            return response()->json([
                'message' => 'Code invalide ou expiré.',
            ], 422);
        }

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès.',
        ]);
    }
}
