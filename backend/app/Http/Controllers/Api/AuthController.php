<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'filiere' => ['nullable', 'string', 'max:255'],
        ]);

        $requireVerification = (bool) config('app.require_email_verification', false);

        $user = User::create([
            'name' => $data['name'] ?? strstr($data['email'], '@', true) ?: $data['email'],
            'email' => $data['email'],
            'password' => $data['password'],
            'filiere' => $data['filiere'] ?? null,
            'email_verified_at' => $requireVerification ? null : now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        if ($requireVerification) {
            try {
                $user->sendEmailVerificationNotification();
            } catch (\Throwable $exception) {
                // Do not block registration if mail transport is unavailable.
            }
        }

        return response()->json([
            'message' => $requireVerification
                ? "Inscription réussie. Un code de vérification a été envoyé à votre adresse e-mail."
                : "Inscription réussie. Votre compte est prêt à être utilisé.",
            'user' => $user,
            'token' => $token,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Les identifiants sont invalides.',
            ], 422);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $token,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
