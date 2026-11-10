<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController
{
    public function send(Request $request): JsonResponse
    {
        $user = $request->user() ?? auth('sanctum')->user();

        if (!$user && $request->filled('email')) {
            $user = User::where('email', $request->email)->first();
        }

        if (!$user) {
            $data = $request->validate([
                'email' => ['required', 'string', 'email'],
            ]);

            $user = User::where('email', $data['email'])->firstOrFail();
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'L’adresse e-mail est déjà vérifiée.',
                'verified' => true,
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Un nouveau code de vérification a été envoyé.',
            'verified' => false,
        ]);
    }

    public function verify(Request $request): JsonResponse
    {
        $rules = [
            'code' => ['required', 'digits:6'],
        ];

        if (!$request->user() && !auth('sanctum')->user()) {
            $rules['email'] = ['required', 'string', 'email'];
        } else {
            $rules['email'] = ['nullable', 'string', 'email'];
        }

        $data = $request->validate($rules);

        $user = $request->user() ?? auth('sanctum')->user();

        if (!$user && isset($data['email'])) {
            $user = User::where('email', $data['email'])->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        if ($request->filled('email') && $user->email !== $request->email) {
            return response()->json([
                'message' => 'L’adresse e-mail ne correspond pas.',
            ], 422);
        }

        if ($user->verifyEmailCode($data['code'])) {
            return response()->json([
                'message' => 'E-mail vérifié avec succès.',
                'verified' => true,
                'user' => $user,
            ]);
        }

        return response()->json([
            'message' => 'Code invalide ou expiré.',
            'verified' => false,
        ], 422);
    }
}
