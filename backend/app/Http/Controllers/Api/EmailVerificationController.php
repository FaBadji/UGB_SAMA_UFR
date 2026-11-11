<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class EmailVerificationController
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['nullable', 'string', 'email'],
        ]);

        $user = $request->user() ?? auth('sanctum')->user();

        if (! $user && ! empty($data['email'])) {
            $user = User::where('email', $data['email'])->first();
        }

        if (! $user && empty($data['email'])) {
            return response()->json([
                'message' => 'Veuillez renseigner votre e-mail.',
            ], 422);
        }

        if ($user?->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'L’adresse e-mail est déjà vérifiée.',
                'verified' => true,
            ]);
        }

        if ($user) {
            try {
                $user->sendEmailVerificationNotification();
            } catch (Throwable $exception) {
                report($exception);

                return response()->json([
                    'message' => "Impossible d'envoyer le code de vérification pour le moment. Réessayez plus tard.",
                    'verified' => false,
                ], 503);
            }
        }

        return response()->json([
            'message' => 'Si un compte non vérifié existe pour cette adresse, un nouveau code de vérification a été envoyé.',
            'verified' => false,
        ]);
    }

    public function verify(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('sanctum')->user();

        $rules = [
            'code' => ['required', 'digits:6'],
            'email' => $user
                ? ['nullable', 'string', 'email']
                : ['required', 'string', 'email'],
        ];

        $data = $request->validate($rules);

        if (! $user) {
            $user = User::where('email', $data['email'])->first();
        }

        if (! $user || ($request->filled('email') && $user->email !== $request->email)) {
            return response()->json([
                'message' => 'Code invalide ou expiré.',
                'verified' => false,
            ], 422);
        }

        if ($user->verifyEmailCode($data['code'])) {
            return response()->json([
                'message' => 'E-mail vérifié avec succès.',
                'verified' => true,
                'user' => $user->refresh(),
            ]);
        }

        return response()->json([
            'message' => 'Code invalide ou expiré.',
            'verified' => false,
        ], 422);
    }
}
